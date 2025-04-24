import numpy as np
from typing import List, Dict
from sklearn.cluster import DBSCAN
from scipy.stats import gaussian_kde

class HeatmapGenerator:
    def __init__(self, grid_size: int = 50):
        self.grid_size = grid_size

    def generate_heatmap(self, gps_data: List[Dict]) -> Dict:
        """
        生成热力图数据
        """
        # 提取经纬度数据
        lats = np.array([point['latitude'] for point in gps_data])
        lngs = np.array([point['longitude'] for point in gps_data])
        
        # 创建网格
        lat_min, lat_max = np.min(lats), np.max(lats)
        lng_min, lng_max = np.min(lngs), np.max(lngs)
        
        lat_grid = np.linspace(lat_min, lat_max, self.grid_size)
        lng_grid = np.linspace(lng_min, lng_max, self.grid_size)
        
        # 使用核密度估计生成热力图
        try:
            # 将经纬度数据转换为网格坐标
            x = (lats - lat_min) / (lat_max - lat_min) * (self.grid_size - 1)
            y = (lngs - lng_min) / (lng_max - lng_min) * (self.grid_size - 1)
            
            # 计算核密度
            xy = np.vstack([x, y])
            kde = gaussian_kde(xy)
            
            # 生成网格点
            xi, yi = np.mgrid[0:self.grid_size:1, 0:self.grid_size:1]
            zi = kde(np.vstack([xi.flatten(), yi.flatten()]))
            
            # 将密度值归一化到0-1范围
            zi = (zi - zi.min()) / (zi.max() - zi.min())
            
            # 生成热力图数据点
            heatmap_data = []
            for i in range(self.grid_size):
                for j in range(self.grid_size):
                    if zi[i, j] > 0.1:  # 只保留密度大于阈值的点
                        lat = lat_grid[i]
                        lng = lng_grid[j]
                        intensity = float(zi[i, j])
                        heatmap_data.append({
                            "lat": lat,
                            "lng": lng,
                            "intensity": intensity
                        })
            
            return {
                "heatmap_data": heatmap_data,
                "bounds": {
                    "north": float(lat_max),
                    "south": float(lat_min),
                    "east": float(lng_max),
                    "west": float(lng_min)
                }
            }
            
        except Exception as e:
            # 如果核密度估计失败，使用简单的点密度
            heatmap_data = []
            for i in range(self.grid_size):
                for j in range(self.grid_size):
                    lat = lat_grid[i]
                    lng = lng_grid[j]
                    
                    # 计算该网格中的点数
                    points_in_cell = np.sum(
                        (lats >= lat) & (lats < lat + (lat_max - lat_min) / self.grid_size) &
                        (lngs >= lng) & (lngs < lng + (lng_max - lng_min) / self.grid_size)
                    )
                    
                    if points_in_cell > 0:
                        intensity = float(points_in_cell) / len(gps_data)
                        heatmap_data.append({
                            "lat": lat,
                            "lng": lng,
                            "intensity": intensity
                        })
            
            return {
                "heatmap_data": heatmap_data,
                "bounds": {
                    "north": float(lat_max),
                    "south": float(lat_min),
                    "east": float(lng_max),
                    "west": float(lng_min)
                }
            }

    def analyze_coverage(self, heatmap_data: List[Dict]) -> Dict:
        """
        分析覆盖情况
        """
        # 将热力图数据转换为numpy数组
        intensities = np.array([point['intensity'] for point in heatmap_data])
        
        # 计算基本统计信息
        mean_intensity = np.mean(intensities)
        std_intensity = np.std(intensities)
        
        # 识别高密度区域
        high_density_threshold = mean_intensity + std_intensity
        high_density_points = [point for point in heatmap_data 
                             if point['intensity'] > high_density_threshold]
        
        # 分析左右平衡
        left_points = [point for point in heatmap_data if point['lng'] < np.median([p['lng'] for p in heatmap_data])]
        right_points = [point for point in heatmap_data if point['lng'] >= np.median([p['lng'] for p in heatmap_data])]
        
        left_intensity = np.mean([p['intensity'] for p in left_points]) if left_points else 0
        right_intensity = np.mean([p['intensity'] for p in right_points]) if right_points else 0
        
        return {
            "mean_intensity": float(mean_intensity),
            "std_intensity": float(std_intensity),
            "high_density_areas": len(high_density_points),
            "left_right_balance": {
                "left_intensity": float(left_intensity),
                "right_intensity": float(right_intensity),
                "balance_ratio": float(left_intensity / right_intensity) if right_intensity > 0 else float('inf')
            }
        } 