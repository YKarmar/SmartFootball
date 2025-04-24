import numpy as np
from shapely.geometry import MultiPoint
from sklearn.decomposition import PCA
from pyproj import Transformer
from typing import List, Tuple


class FieldEstimator:
    """
    根据GPS坐标估算用户运动范围内的足球场尺寸;单位：米
    """

    def __init__(self, utm_epsg: str = "32633"):
        """
        构造函数
        参数:
        - utm_epsg: 投影区域的 EPSG 代码; 默认使用 UTM zone 33
        """
        self.utm_epsg = utm_epsg
        self.transformer = Transformer.from_crs("epsg:4326", f"epsg:{utm_epsg}", always_xy=True)

    def estimate(self, gps_points: List[Tuple[float, float]]) -> Tuple[float, float]:
        """
        主函数：估算场地长宽
        参数:
        - gps_points: List of (latitude, longitude)

        返回:
        - (length, width): 按主方向估算的场地尺寸，单位为米
        """

        if len(gps_points) < 3:
            raise ValueError("The number of GPS points must be greater than 2")

        # 1. 经纬度转 UTM 投影坐标（米）
        projected_points = [self.transformer.transform(lon, lat) for lat, lon in gps_points]

        # 2. 构建凸包边界
        hull = MultiPoint(projected_points).convex_hull
        if hull.geom_type == 'Polygon':
            coords = np.array(hull.exterior.coords)
        else:
            coords = np.array(projected_points)

        # 3. PCA主方向提取尺寸
        pca = PCA(n_components=2)
        transformed = pca.fit_transform(coords)

        length = transformed[:, 0].max() - transformed[:, 0].min()
        width = transformed[:, 1].max() - transformed[:, 1].min()

        return tuple(sorted([length, width], reverse=True))
