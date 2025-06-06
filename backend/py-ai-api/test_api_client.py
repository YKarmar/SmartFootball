"""
足球场尺寸估算API测试客户端
演示如何调用不同的API端点
"""

import requests
import numpy as np
import base64
import io
from PIL import Image
import json
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FieldEstimatorAPIClient:
    """API客户端类"""
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def health_check(self):
        """健康检查"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"健康检查失败: {e}")
            return None
    
    def get_model_info(self):
        """获取模型信息"""
        try:
            response = self.session.get(f"{self.base_url}/info")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"获取模型信息失败: {e}")
            return None
    
    def predict_from_array(self, heatmap_data):
        """使用数组数据预测"""
        try:
            payload = {"heatmap_data": heatmap_data}
            response = self.session.post(
                f"{self.base_url}/predict/array",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"数组预测失败: {e}")
            return None
    
    def predict_from_base64(self, image_base64):
        """使用Base64图像预测"""
        try:
            payload = {"image_base64": image_base64}
            response = self.session.post(
                f"{self.base_url}/predict/image",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Base64预测失败: {e}")
            return None
    
    def predict_from_file(self, image_path):
        """使用文件上传预测"""
        try:
            with open(image_path, 'rb') as f:
                files = {'file': f}
                response = self.session.post(
                    f"{self.base_url}/predict/file",
                    files=files
                )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"文件预测失败: {e}")
            return None


def create_sample_heatmap_array(length=105.0, width=68.0, size=(64, 64)):
    """创建示例热力图数组"""
    h, w = size
    
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
    
    # 添加一些活动热点
    hotspots = [
        (h//4, w//4, 0.6, 5),
        (3*h//4, w//4, 0.5, 4),
        (h//2, w//2, 0.8, 6),
        (h//4, 3*w//4, 0.5, 4),
        (3*h//4, 3*w//4, 0.6, 5),
    ]
    
    for hot_y, hot_x, intensity, spread in hotspots:
        hot_dist = np.exp(-((x - hot_x)**2 + (y - hot_y)**2) / (2 * spread**2))
        heatmap += intensity * hot_dist
    
    # 归一化到[0,1]
    heatmap = np.clip(heatmap, 0, 1)
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
    
    return heatmap


def create_sample_base64_image(length=105.0, width=68.0, size=(64, 64)):
    """创建示例Base64图像"""
    heatmap = create_sample_heatmap_array(length, width, size)
    
    # 转换为PIL图像
    image_array = (heatmap * 255).astype(np.uint8)
    image = Image.fromarray(image_array, mode='L')
    
    # 转换为Base64
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return image_base64


def main():
    """主测试函数"""
    # 初始化客户端
    client = FieldEstimatorAPIClient()
    
    logger.info("🧪 开始API测试...")
    
    # 1. 健康检查
    logger.info("1. 健康检查...")
    health = client.health_check()
    if health:
        logger.info(f"✅ 健康检查通过: {health}")
    else:
        logger.error("❌ 健康检查失败")
        return
    
    # 2. 获取模型信息
    logger.info("2. 获取模型信息...")
    model_info = client.get_model_info()
    if model_info:
        logger.info(f"✅ 模型信息: {json.dumps(model_info, indent=2, ensure_ascii=False)}")
    else:
        logger.error("❌ 获取模型信息失败")
    
    # 3. 测试不同场地尺寸的预测
    test_cases = [
        (105.0, 68.0, "标准FIFA足球场"),
        (100.0, 64.0, "小型足球场"),
        (110.0, 75.0, "大型足球场"),
        (90.0, 45.0, "迷你足球场"),
    ]
    
    for true_length, true_width, description in test_cases:
        logger.info(f"\n--- 测试: {description} ({true_length}m × {true_width}m) ---")
        
        # 3a. 数组预测
        logger.info("3a. 数组数据预测...")
        heatmap_array = create_sample_heatmap_array(true_length, true_width)
        heatmap_list = heatmap_array.tolist()
        
        result = client.predict_from_array(heatmap_list)
        if result:
            pred_length = result['length']
            pred_width = result['width']
            length_error = abs(pred_length - true_length)
            width_error = abs(pred_width - true_width)
            
            logger.info(f"✅ 数组预测结果: {pred_length:.1f}m × {pred_width:.1f}m")
            logger.info(f"   误差: 长度 {length_error:.1f}m, 宽度 {width_error:.1f}m")
        else:
            logger.error("❌ 数组预测失败")
        
        # 3b. Base64图像预测
        logger.info("3b. Base64图像预测...")
        image_base64 = create_sample_base64_image(true_length, true_width)
        
        result = client.predict_from_base64(image_base64)
        if result:
            pred_length = result['length']
            pred_width = result['width']
            length_error = abs(pred_length - true_length)
            width_error = abs(pred_width - true_width)
            
            logger.info(f"✅ Base64预测结果: {pred_length:.1f}m × {pred_width:.1f}m")
            logger.info(f"   误差: 长度 {length_error:.1f}m, 宽度 {width_error:.1f}m")
        else:
            logger.error("❌ Base64预测失败")
    
    # 4. 测试错误情况
    logger.info("\n4. 测试错误处理...")
    
    # 测试空数组
    logger.info("4a. 测试空数组...")
    result = client.predict_from_array([])
    if result:
        logger.error("❌ 空数组应该返回错误")
    else:
        logger.info("✅ 空数组正确返回错误")
    
    # 测试无效Base64
    logger.info("4b. 测试无效Base64...")
    result = client.predict_from_base64("invalid_base64")
    if result:
        logger.error("❌ 无效Base64应该返回错误")
    else:
        logger.info("✅ 无效Base64正确返回错误")
    
    logger.info("\n🎉 API测试完成！")


if __name__ == "__main__":
    main() 