import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader, random_split
import numpy as np
import logging
from typing import List, Tuple
import os
from pathlib import Path
import argparse
from tqdm import tqdm
import matplotlib.pyplot as plt

from field_estimator import FieldEstimator, create_mse_loss, create_optimizer, create_scheduler

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HeatmapDataset(Dataset):
    """
    热力图数据集类
    """
    
    def __init__(self, heatmaps: List[np.ndarray], targets: List[Tuple[float, float]], 
                 augment: bool = True):
        """
        参数:
        - heatmaps: 热力图列表
        - targets: 对应的场地尺寸标签 [(length, width), ...]
        - augment: 是否进行数据增强
        """
        self.heatmaps = heatmaps
        self.targets = targets
        self.augment = augment
        
    def __len__(self):
        return len(self.heatmaps)
    
    def __getitem__(self, idx):
        heatmap = self.heatmaps[idx].copy()
        target = np.array(self.targets[idx], dtype=np.float32)
        
        # 数据增强
        if self.augment:
            heatmap = self._augment_heatmap(heatmap)
        
        # 确保热力图是单通道
        if heatmap.ndim == 2:
            heatmap = heatmap[np.newaxis, :]  # 添加通道维度 (1, H, W)
        
        # 归一化
        heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
        
        return torch.from_numpy(heatmap).float(), torch.from_numpy(target).float()
    
    def _augment_heatmap(self, heatmap: np.ndarray) -> np.ndarray:
        """
        数据增强：随机水平/垂直翻转和小幅仿射变换
        """
        # 随机水平翻转
        if np.random.random() > 0.5:
            heatmap = np.fliplr(heatmap)
        
        # 随机垂直翻转
        if np.random.random() > 0.5:
            heatmap = np.flipud(heatmap)
        
        # 简单的噪声增强
        if np.random.random() > 0.7:
            noise = np.random.normal(0, 0.01, heatmap.shape)
            heatmap = np.clip(heatmap + noise, 0, 1)
        
        return heatmap


def generate_synthetic_data(num_samples: int = 1000, image_size: Tuple[int, int] = (64, 64)) -> Tuple[List[np.ndarray], List[Tuple[float, float]]]:
    """
    生成合成训练数据（用于演示）
    在实际应用中，您需要使用真实的热力图数据
    """
    heatmaps = []
    targets = []
    
    for _ in range(num_samples):
        # 随机生成场地尺寸 (标准足球场：100-110m x 64-75m)
        length = np.random.uniform(90, 120)  # 米
        width = np.random.uniform(45, 90)    # 米
        
        # 确保长度 >= 宽度
        if width > length:
            length, width = width, length
        
        # 生成对应的热力图（简化的高斯分布模拟）
        h, w = image_size
        
        # 根据场地比例调整热力图的分布
        length_ratio = length / 120.0  # 归一化到 [0.75, 1.0]
        width_ratio = width / 90.0     # 归一化到 [0.5, 1.0]
        
        # 创建椭圆形分布的热力图
        y, x = np.ogrid[:h, :w]
        center_y, center_x = h // 2, w // 2
        
        # 根据场地比例调整椭圆参数
        sigma_y = h * width_ratio * 0.3
        sigma_x = w * length_ratio * 0.3
        
        heatmap = np.exp(-((x - center_x)**2 / (2 * sigma_x**2) + 
                          (y - center_y)**2 / (2 * sigma_y**2)))
        
        # 添加一些随机噪声和活动热点
        num_hotspots = np.random.randint(3, 8)
        for _ in range(num_hotspots):
            hot_y = np.random.randint(h//4, 3*h//4)
            hot_x = np.random.randint(w//4, 3*w//4)
            intensity = np.random.uniform(0.3, 0.8)
            spread = np.random.uniform(3, 8)
            
            hot_dist = np.exp(-((x - hot_x)**2 + (y - hot_y)**2) / (2 * spread**2))
            heatmap += intensity * hot_dist
        
        # 归一化
        heatmap = np.clip(heatmap, 0, 1)
        
        heatmaps.append(heatmap)
        targets.append((length, width))
    
    return heatmaps, targets


def train_model(train_loader: DataLoader, val_loader: DataLoader, 
                num_epochs: int = 50, device: str = 'cpu', 
                save_path: str = 'field_estimator_model.pth'):
    """
    训练模型
    """
    # 初始化模型
    estimator = FieldEstimator(device=device)
    
    # 损失函数和优化器
    criterion = create_mse_loss()
    optimizer = create_optimizer(estimator.model, lr=1e-3)
    scheduler = create_scheduler(optimizer, step_size=10, gamma=0.1)
    
    # 早停参数
    best_val_loss = float('inf')
    patience = 5
    patience_counter = 0
    
    # 训练历史
    train_losses = []
    val_losses = []
    
    logger.info(f"开始训练，设备: {device}")
    
    for epoch in range(num_epochs):
        # 训练阶段
        estimator.model.train()
        epoch_train_loss = 0.0
        num_batches = 0
        
        with tqdm(train_loader, desc=f'Epoch {epoch+1}/{num_epochs}') as pbar:
            for heatmap, target in pbar:
                loss = estimator.train_step(heatmap, target, optimizer, criterion)
                epoch_train_loss += loss
                num_batches += 1
                
                pbar.set_postfix({'loss': f'{loss:.6f}'})
        
        avg_train_loss = epoch_train_loss / num_batches
        train_losses.append(avg_train_loss)
        
        # 验证阶段
        avg_val_loss = estimator.validate(val_loader, criterion)
        val_losses.append(avg_val_loss)
        
        # 更新学习率
        scheduler.step()
        
        logger.info(f'Epoch {epoch+1}: Train Loss: {avg_train_loss:.6f}, Val Loss: {avg_val_loss:.6f}')
        
        # 早停检查
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            patience_counter = 0
            # 保存最佳模型
            estimator.save_model(save_path, optimizer, epoch, avg_val_loss)
            logger.info(f'新的最佳模型已保存: {save_path}')
        else:
            patience_counter += 1
            if patience_counter >= patience:
                logger.info(f'验证损失连续{patience}个epoch未改善，提前停止训练')
                break
    
    # 绘制训练曲线
    plt.figure(figsize=(10, 6))
    plt.plot(train_losses, label='Training Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('MSE Loss')
    plt.title('Training History')
    plt.legend()
    plt.grid(True)
    plt.savefig('training_history.png')
    plt.show()
    
    return estimator


def test_model(estimator: FieldEstimator, test_data: List[Tuple[np.ndarray, Tuple[float, float]]]):
    """
    测试模型性能
    """
    logger.info("测试模型性能...")
    
    total_length_error = 0.0
    total_width_error = 0.0
    num_samples = len(test_data)
    
    for heatmap, true_target in test_data:
        pred_length, pred_width = estimator.estimate(heatmap)
        true_length, true_width = true_target
        
        length_error = abs(pred_length - true_length)
        width_error = abs(pred_width - true_width)
        
        total_length_error += length_error
        total_width_error += width_error
        
        logger.debug(f"真实: ({true_length:.1f}, {true_width:.1f}), "
                    f"预测: ({pred_length:.1f}, {pred_width:.1f}), "
                    f"误差: ({length_error:.1f}, {width_error:.1f})")
    
    avg_length_error = total_length_error / num_samples
    avg_width_error = total_width_error / num_samples
    
    logger.info(f"平均长度误差: {avg_length_error:.2f} 米")
    logger.info(f"平均宽度误差: {avg_width_error:.2f} 米")
    logger.info(f"总体平均误差: {(avg_length_error + avg_width_error) / 2:.2f} 米")


def main():
    parser = argparse.ArgumentParser(description='训练足球场尺寸估算模型')
    parser.add_argument('--batch_size', type=int, default=32, help='批量大小')
    parser.add_argument('--epochs', type=int, default=50, help='训练轮数')
    parser.add_argument('--num_samples', type=int, default=1000, help='合成数据样本数')
    parser.add_argument('--device', type=str, default='auto', help='计算设备')
    parser.add_argument('--save_path', type=str, default='field_estimator_model.pth', help='模型保存路径')
    
    args = parser.parse_args()
    
    # 设备选择
    if args.device == 'auto':
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
    else:
        device = args.device
    
    logger.info(f"使用设备: {device}")
    
    # 生成合成数据
    logger.info(f"生成{args.num_samples}个合成训练样本...")
    heatmaps, targets = generate_synthetic_data(args.num_samples)
    
    # 创建数据集
    dataset = HeatmapDataset(heatmaps, targets, augment=True)
    
    # 划分训练集、验证集、测试集
    train_size = int(0.7 * len(dataset))
    val_size = int(0.2 * len(dataset))
    test_size = len(dataset) - train_size - val_size
    
    train_dataset, val_dataset, test_dataset = random_split(
        dataset, [train_size, val_size, test_size],
        generator=torch.Generator().manual_seed(42)
    )
    
    # 创建数据加载器
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False)
    
    logger.info(f"训练集: {len(train_dataset)}, 验证集: {len(val_dataset)}, 测试集: {len(test_dataset)}")
    
    # 训练模型
    estimator = train_model(
        train_loader, val_loader, 
        num_epochs=args.epochs, 
        device=device,
        save_path=args.save_path
    )
    
    # 测试模型
    test_data = [(heatmaps[i], targets[i]) for i in range(-test_size, 0)]
    test_model(estimator, test_data)
    
    logger.info("训练完成！")


if __name__ == '__main__':
    main() 