"""
足球场尺寸估算器使用示例
演示如何使用基于CNN的FieldEstimator来估算场地尺寸
"""

import numpy as np
import matplotlib.pyplot as plt
from field_estimator import FieldEstimator
import torch
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_sample_heatmap(length: float = 105.0, width: float = 68.0, 
                         image_size: tuple = (64, 64)) -> np.ndarray:
    """
    创建示例热力图
    参数:
    - length: 场地长度（米）
    - width: 场地宽度（米）
    - image_size: 图像尺寸
    
    返回:
    - np.ndarray: 热力图
    """
    h, w = image_size
    
    # 根据场地比例调整热力图的分布
    length_ratio = length / 120.0
    width_ratio = width / 90.0
    
    # 创建椭圆形分布的热力图
    y, x = np.ogrid[:h, :w]
    center_y, center_x = h // 2, w // 2
    
    # 根据场地比例调整椭圆参数
    sigma_y = h * width_ratio * 0.3
    sigma_x = w * length_ratio * 0.3
    
    heatmap = np.exp(-((x - center_x)**2 / (2 * sigma_x**2) + 
                      (y - center_y)**2 / (2 * sigma_y**2)))
    
    # 添加一些活动热点（模拟球员聚集区域）
    hotspots = [
        (h//4, w//4, 0.6, 5),      # 左上角
        (3*h//4, w//4, 0.5, 4),    # 左下角
        (h//2, w//2, 0.8, 6),      # 中央
        (h//4, 3*w//4, 0.5, 4),    # 右上角
        (3*h//4, 3*w//4, 0.6, 5),  # 右下角
    ]
    
    for hot_y, hot_x, intensity, spread in hotspots:
        hot_dist = np.exp(-((x - hot_x)**2 + (y - hot_y)**2) / (2 * spread**2))
        heatmap += intensity * hot_dist
    
    # 归一化到 [0, 1]
    heatmap = np.clip(heatmap, 0, 1)
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
    
    return heatmap


def visualize_heatmap(heatmap: np.ndarray, title: str = "Heatmap"):
    """可视化热力图"""
    plt.figure(figsize=(8, 6))
    plt.imshow(heatmap, cmap='hot', interpolation='bilinear')
    plt.colorbar(label='Activity Intensity')
    plt.title(title)
    plt.xlabel('Width Direction')
    plt.ylabel('Length Direction')
    plt.show()


def main():
    """主函数：演示使用流程"""
    
    logger.info("=== 足球场尺寸估算器 CNN 模型使用示例 ===")
    
    # 1. 初始化模型（没有预训练权重时会使用ImageNet预训练的特征提取器）
    logger.info("1. 初始化模型...")
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    estimator = FieldEstimator(device=device)
    logger.info(f"模型已初始化，使用设备: {device}")
    
    # 2. 创建测试用的热力图
    logger.info("2. 创建测试热力图...")
    
    # 测试不同尺寸的场地
    test_cases = [
        (105.0, 68.0, "标准FIFA足球场"),
        (100.0, 64.0, "小型足球场"),
        (110.0, 75.0, "大型足球场"),
        (90.0, 45.0, "迷你足球场"),
    ]
    
    for true_length, true_width, description in test_cases:
        logger.info(f"\n--- 测试案例: {description} ---")
        logger.info(f"真实尺寸: {true_length}m x {true_width}m")
        
        # 创建热力图
        heatmap = create_sample_heatmap(true_length, true_width)
        
        # 可视化热力图（可选）
        # visualize_heatmap(heatmap, f"{description} - 热力图")
        
        # 使用模型估算尺寸
        try:
            pred_length, pred_width = estimator.estimate(heatmap)
            
            # 计算误差
            length_error = abs(pred_length - true_length)
            width_error = abs(pred_width - true_width)
            
            logger.info(f"预测尺寸: {pred_length:.1f}m x {pred_width:.1f}m")
            logger.info(f"误差: 长度 {length_error:.1f}m, 宽度 {width_error:.1f}m")
            logger.info(f"相对误差: 长度 {length_error/true_length*100:.1f}%, 宽度 {width_error/true_width*100:.1f}%")
            
        except Exception as e:
            logger.error(f"估算失败: {e}")
    
    # 3. 演示批量处理
    logger.info("\n3. 演示批量处理...")
    batch_heatmaps = []
    batch_targets = []
    
    for true_length, true_width, _ in test_cases:
        heatmap = create_sample_heatmap(true_length, true_width)
        batch_heatmaps.append(heatmap)
        batch_targets.append((true_length, true_width))
    
    # 批量预测
    total_length_error = 0
    total_width_error = 0
    
    for i, (heatmap, (true_length, true_width)) in enumerate(zip(batch_heatmaps, batch_targets)):
        pred_length, pred_width = estimator.estimate(heatmap)
        
        length_error = abs(pred_length - true_length)
        width_error = abs(pred_width - true_width)
        
        total_length_error += length_error
        total_width_error += width_error
        
        logger.info(f"样本 {i+1}: 真实({true_length:.1f}, {true_width:.1f}) "
                   f"-> 预测({pred_length:.1f}, {pred_width:.1f})")
    
    avg_length_error = total_length_error / len(batch_targets)
    avg_width_error = total_width_error / len(batch_targets)
    
    logger.info(f"\n批量处理结果:")
    logger.info(f"平均长度误差: {avg_length_error:.2f}m")
    logger.info(f"平均宽度误差: {avg_width_error:.2f}m")
    logger.info(f"总体平均误差: {(avg_length_error + avg_width_error)/2:.2f}m")
    
    # 4. 模型信息
    logger.info("\n4. 模型信息:")
    total_params = sum(p.numel() for p in estimator.model.parameters())
    trainable_params = sum(p.numel() for p in estimator.model.parameters() if p.requires_grad)
    
    logger.info(f"总参数数量: {total_params:,}")
    logger.info(f"可训练参数: {trainable_params:,}")
    logger.info(f"模型大小: {total_params * 4 / (1024**2):.2f} MB (假设32位浮点)")
    
    logger.info("\n=== 示例完成 ===")
    
    # 如果需要保存模型用于后续使用
    # estimator.save_model('example_model.pth')
    # logger.info("模型已保存为 'example_model.pth'")


if __name__ == '__main__':
    main() 