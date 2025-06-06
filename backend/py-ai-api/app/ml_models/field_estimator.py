import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class InvertedResidual(nn.Module):
    """MobileNet-V2的Bottleneck块"""
    def __init__(self, inp, oup, stride, expand_ratio):
        super(InvertedResidual, self).__init__()
        self.stride = stride
        hidden_dim = int(round(inp * expand_ratio))
        self.use_res_connect = self.stride == 1 and inp == oup

        layers = []
        if expand_ratio != 1:
            # 1x1 pointwise conv
            layers.append(nn.Conv2d(inp, hidden_dim, 1, 1, 0, bias=False))
            layers.append(nn.BatchNorm2d(hidden_dim))
            layers.append(nn.ReLU6(inplace=True))
        
        layers.extend([
            # 3x3 depthwise conv
            nn.Conv2d(hidden_dim, hidden_dim, 3, stride, 1, groups=hidden_dim, bias=False),
            nn.BatchNorm2d(hidden_dim),
            nn.ReLU6(inplace=True),
            # 1x1 pointwise conv
            nn.Conv2d(hidden_dim, oup, 1, 1, 0, bias=False),
            nn.BatchNorm2d(oup),
        ])
        self.conv = nn.Sequential(*layers)

    def forward(self, x):
        if self.use_res_connect:
            return x + self.conv(x)
        else:
            return self.conv(x)


class ModifiedMobileNetV2(nn.Module):
    """
    修改版MobileNet-V2用于足球场尺寸估算
    主要修改：
    1. 输入层：3x3x1接受单通道热力图
    2. 保留Bottleneck块和深度可分离卷积
    3. 全局平均池化
    4. 回归头：两个全连接层预测长度和宽度
    """
    
    def __init__(self, num_classes=2, width_mult=1.0, dropout=0.2):
        super(ModifiedMobileNetV2, self).__init__()
        
        # 设置通道数
        input_channel = 32
        last_channel = 1280
        
        # MobileNet-V2配置: [t, c, n, s]
        # t: expansion factor, c: output channels, n: number of repetitions, s: stride
        interverted_residual_setting = [
            [1, 16, 1, 1],
            [6, 24, 2, 2],
            [6, 32, 3, 2],
            [6, 64, 4, 2],
            [6, 96, 3, 1],
            [6, 160, 3, 2],
            [6, 320, 1, 1],
        ]

        # 构建特征提取器
        features = []
        
        # 第一层：修改为接受单通道输入 (3x3x1)
        input_channel = int(input_channel * width_mult)
        features.append(nn.Conv2d(1, input_channel, 3, 2, 1, bias=False))  # 修改：输入通道从3改为1
        features.append(nn.BatchNorm2d(input_channel))
        features.append(nn.ReLU6(inplace=True))
        
        # 构建Bottleneck层
        for t, c, n, s in interverted_residual_setting:
            output_channel = int(c * width_mult)
            for i in range(n):
                stride = s if i == 0 else 1
                features.append(InvertedResidual(input_channel, output_channel, stride, expand_ratio=t))
                input_channel = output_channel
        
        # 最后的1x1卷积
        last_channel = int(last_channel * max(1.0, width_mult))
        features.append(nn.Conv2d(input_channel, last_channel, 1, 1, 0, bias=False))
        features.append(nn.BatchNorm2d(last_channel))
        features.append(nn.ReLU6(inplace=True))
        
        self.features = nn.Sequential(*features)
        
        # 全局平均池化
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        
        # 回归头：两个全连接层
        self.regressor = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(last_channel, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(512, num_classes)  # 输出长度和宽度
        )
        
        # 初始化权重
        self._initialize_weights()
    
    def _initialize_weights(self):
        """初始化模型权重"""
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out')
                if m.bias is not None:
                    nn.init.zeros_(m.bias)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.ones_(m.weight)
                nn.init.zeros_(m.bias)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.zeros_(m.bias)
    
    def load_pretrained_weights(self):
        """加载ImageNet预训练权重（除了第一层）"""
        try:
            pretrained = models.mobilenet_v2(pretrained=True)
            pretrained_dict = pretrained.state_dict()
            model_dict = self.state_dict()
            
            # 过滤掉第一层和分类器的权重
            pretrained_dict = {k: v for k, v in pretrained_dict.items() 
                             if k in model_dict and 'features.0' not in k and 'classifier' not in k}
            
            model_dict.update(pretrained_dict)
            self.load_state_dict(model_dict)
            logger.info("成功加载ImageNet预训练权重")
        except Exception as e:
            logger.warning(f"加载预训练权重失败: {e}")
    
    def forward(self, x):
        """前向传播"""
        # 特征提取
        x = self.features(x)
        
        # 全局平均池化
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        
        # 回归预测
        x = self.regressor(x)
        
        # 确保输出为正数（场地尺寸不能为负）
        x = torch.abs(x)
        
        return x


class FieldEstimator:
    """
    基于CNN的足球场尺寸估算器
    使用修改版MobileNet-V2处理热力图来估算场地尺寸
    """
    
    def __init__(self, model_path: Optional[str] = None, device: Optional[str] = None):
        """
        构造函数
        参数:
        - model_path: 预训练模型路径
        - device: 计算设备 ('cpu', 'cuda', 'mps' 等)
        """
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = ModifiedMobileNetV2(num_classes=2)
        self.model.to(self.device)
        
        if model_path:
            self.load_model(model_path)
        else:
            # 加载ImageNet预训练权重
            self.model.load_pretrained_weights()
        
        self.model.eval()
    
    def load_model(self, model_path: str):
        """加载训练好的模型"""
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(checkpoint['model_state_dict'])
            logger.info(f"成功加载模型: {model_path}")
        except Exception as e:
            logger.error(f"加载模型失败: {e}")
            raise
    
    def save_model(self, model_path: str, optimizer=None, epoch=None, loss=None):
        """保存模型"""
        try:
            checkpoint = {
                'model_state_dict': self.model.state_dict(),
                'epoch': epoch,
                'loss': loss
            }
            if optimizer:
                checkpoint['optimizer_state_dict'] = optimizer.state_dict()
            
            torch.save(checkpoint, model_path)
            logger.info(f"模型已保存: {model_path}")
        except Exception as e:
            logger.error(f"保存模型失败: {e}")
            raise
    
    def preprocess_heatmap(self, heatmap: np.ndarray) -> torch.Tensor:
        """
        预处理热力图
        参数:
        - heatmap: numpy数组，形状为 (H, W) 或 (1, H, W)
        
        返回:
        - torch.Tensor: 预处理后的张量，形状为 (1, 1, H, W)
        """
        if heatmap.ndim == 2:
            heatmap = heatmap[np.newaxis, :]  # 添加通道维度
        
        if heatmap.ndim == 3 and heatmap.shape[0] != 1:
            heatmap = heatmap[0:1, :, :]  # 只取第一个通道
        
        # 归一化到 [0, 1]
        heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
        
        # 转换为张量并添加批次维度
        tensor = torch.from_numpy(heatmap).float()
        if tensor.ndim == 3:
            tensor = tensor.unsqueeze(0)  # 添加批次维度: (1, 1, H, W)
        
        return tensor.to(self.device)
    
    def estimate(self, heatmap: np.ndarray) -> Tuple[float, float]:
        """
        主函数：从热力图估算场地长宽
        参数:
        - heatmap: 热力图数组，形状为 (H, W) 或 (1, H, W)
        
        返回:
        - (length, width): 估算的场地尺寸，单位为米
        """
        try:
            # 预处理热力图
            input_tensor = self.preprocess_heatmap(heatmap)
            
            # 模型推理
            with torch.no_grad():
                predictions = self.model(input_tensor)
                length, width = predictions[0].cpu().numpy()
            
            # 确保长度 >= 宽度
            length, width = max(length, width), min(length, width)
            
            return float(length), float(width)
        
        except Exception as e:
            logger.error(f"场地尺寸估算失败: {e}")
            raise
    
    def train_step(self, heatmap: torch.Tensor, target: torch.Tensor, 
                   optimizer: torch.optim.Optimizer, criterion: nn.Module) -> float:
        """
        单步训练
        参数:
        - heatmap: 输入热力图批次 (B, 1, H, W)
        - target: 目标尺寸 (B, 2) [length, width]
        - optimizer: 优化器
        - criterion: 损失函数
        
        返回:
        - loss: 损失值
        """
        self.model.train()
        
        heatmap = heatmap.to(self.device)
        target = target.to(self.device)
        
        # 前向传播
        predictions = self.model(heatmap)
        loss = criterion(predictions, target)
        
        # 反向传播
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        return loss.item()
    
    def validate(self, val_loader, criterion: nn.Module) -> float:
        """
        验证模型
        参数:
        - val_loader: 验证数据加载器
        - criterion: 损失函数
        
        返回:
        - avg_loss: 平均验证损失
        """
        self.model.eval()
        total_loss = 0.0
        num_batches = 0
        
        with torch.no_grad():
            for heatmap, target in val_loader:
                heatmap = heatmap.to(self.device)
                target = target.to(self.device)
                
                predictions = self.model(heatmap)
                loss = criterion(predictions, target)
                
                total_loss += loss.item()
                num_batches += 1
        
        return total_loss / num_batches if num_batches > 0 else 0.0


def create_mse_loss():
    """创建MSE损失函数"""
    return nn.MSELoss()


def create_optimizer(model: nn.Module, lr: float = 1e-3) -> torch.optim.Optimizer:
    """创建Adam优化器"""
    return torch.optim.Adam(model.parameters(), lr=lr)


def create_scheduler(optimizer: torch.optim.Optimizer, step_size: int = 10, gamma: float = 0.1):
    """创建学习率调度器"""
    return torch.optim.lr_scheduler.StepLR(optimizer, step_size=step_size, gamma=gamma)
