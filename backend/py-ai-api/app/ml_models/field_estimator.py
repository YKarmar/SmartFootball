import numpy as np
from typing import List, Dict
from sklearn.cluster import DBSCAN
from scipy.spatial import ConvexHull

class FieldEstimator:
    def __init__(self, eps: float = 0.0001, min_samples: int = 5):
        self.eps = eps
        self.min_samples = min_samples

    def estimate_field_boundary(self, gps_data: List[Dict]) -> Dict:
        """
        估计足球场边界
        """
        # 提取经纬度数据
        points = np.array([[point['latitude'], point['longitude']] for point in gps_data])
        
        # 使用DBSCAN聚类找出主要活动区域
        dbscan = DBSCAN(eps=self.eps, min_samples=self.min_samples)
        labels = dbscan.fit_predict(points)
        
        # 找出最大的聚类（主要活动区域）
        if len(set(labels)) > 1:
            main_cluster = points[labels == max(set(labels), key=list(labels).count)]
        else:
            main_cluster = points
        
        # 使用凸包算法估计场地边界
        try:
            hull = ConvexHull(main_cluster)
            boundary_points = main_cluster[hull.vertices]
            
            # 将边界点转换为字典格式
            boundary = [
                {"lat": float(point[0]), "lng": float(point[1])}
                for point in boundary_points
            ]
            
            # 计算场地尺寸（近似）
            lat_range = np.ptp(boundary_points[:, 0])
            lng_range = np.ptp(boundary_points[:, 1])
            
            # 估算场地面积（平方米）
            # 使用简化的距离计算（1度纬度约111km，1度经度随纬度变化）
            avg_lat = np.mean(boundary_points[:, 0])
            lat_meters = lat_range * 111000  # 转换为米
            lng_meters = lng_range * 111000 * np.cos(np.radians(avg_lat))
            area = lat_meters * lng_meters
            
            return {
                "boundary": boundary,
                "dimensions": {
                    "length": float(lat_meters),
                    "width": float(lng_meters),
                    "area": float(area)
                },
                "confidence": 0.8  # 可以根据边界点的分布计算置信度
            }
            
        except Exception as e:
            # 如果凸包算法失败，使用简单的矩形边界
            lat_min, lat_max = np.min(points[:, 0]), np.max(points[:, 0])
            lng_min, lng_max = np.min(points[:, 1]), np.max(points[:, 1])
            
            boundary = [
                {"lat": float(lat_min), "lng": float(lng_min)},
                {"lat": float(lat_min), "lng": float(lng_max)},
                {"lat": float(lat_max), "lng": float(lng_max)},
                {"lat": float(lat_max), "lng": float(lng_min)}
            ]
            
            # 计算场地尺寸
            lat_meters = (lat_max - lat_min) * 111000
            lng_meters = (lng_max - lng_min) * 111000 * np.cos(np.radians((lat_max + lat_min) / 2))
            area = lat_meters * lng_meters
            
            return {
                "boundary": boundary,
                "dimensions": {
                    "length": float(lat_meters),
                    "width": float(lng_meters),
                    "area": float(area)
                },
                "confidence": 0.6  # 矩形边界的置信度较低
            }

    def validate_field_size(self, dimensions: Dict) -> Dict:
        """
        验证估计的场地尺寸是否合理
        """
        length = dimensions['length']
        width = dimensions['width']
        area = dimensions['area']
        
        # 标准足球场尺寸范围（米）
        standard_length_range = (90, 120)
        standard_width_range = (45, 90)
        standard_area_range = (4050, 10800)  # 45m x 90m 到 120m x 90m
        
        # 检查尺寸是否在合理范围内
        length_valid = standard_length_range[0] <= length <= standard_length_range[1]
        width_valid = standard_width_range[0] <= width <= standard_width_range[1]
        area_valid = standard_area_range[0] <= area <= standard_area_range[1]
        
        # 计算与标准尺寸的偏差
        length_deviation = min(abs(length - standard_length_range[0]),
                             abs(length - standard_length_range[1])) / length
        width_deviation = min(abs(width - standard_width_range[0]),
                            abs(width - standard_width_range[1])) / width
        
        return {
            "is_valid": length_valid and width_valid and area_valid,
            "deviations": {
                "length": float(length_deviation),
                "width": float(width_deviation)
            },
            "suggestions": [
                "场地长度似乎偏短" if length < standard_length_range[0] else
                "场地长度似乎偏长" if length > standard_length_range[1] else None,
                "场地宽度似乎偏窄" if width < standard_width_range[0] else
                "场地宽度似乎偏宽" if width > standard_width_range[1] else None
            ]
        } 