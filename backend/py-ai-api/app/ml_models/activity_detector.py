import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import List, Dict
import json

class ActivityDetector:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)
        self.is_trained = False

    def preprocess_data(self, activity_data: Dict) -> np.ndarray:
        """
        预处理活动数据，提取特征
        """
        features = []
        
        # 处理GPS数据
        gps_data = activity_data.get('gps_data', [])
        if gps_data:
            # 计算GPS轨迹的基本统计特征
            lats = [point['latitude'] for point in gps_data]
            lngs = [point['longitude'] for point in gps_data]
            
            features.extend([
                np.mean(lats),
                np.std(lats),
                np.mean(lngs),
                np.std(lngs),
                len(gps_data)  # 数据点数量
            ])
        
        # 处理运动数据
        motion_data = activity_data.get('motion_data', [])
        if motion_data:
            # 计算加速度和陀螺仪数据的统计特征
            acc_x = [point['accelerometer']['x'] for point in motion_data]
            acc_y = [point['accelerometer']['y'] for point in motion_data]
            acc_z = [point['accelerometer']['z'] for point in motion_data]
            
            features.extend([
                np.mean(acc_x),
                np.std(acc_x),
                np.mean(acc_y),
                np.std(acc_y),
                np.mean(acc_z),
                np.std(acc_z)
            ])
        
        # 处理心率数据
        heart_rate = activity_data.get('heart_rate', [])
        if heart_rate:
            hr_values = [hr['value'] for hr in heart_rate]
            features.extend([
                np.mean(hr_values),
                np.std(hr_values),
                np.max(hr_values),
                np.min(hr_values)
            ])
        
        return np.array(features)

    def train(self, training_data: List[Dict], labels: List[str]):
        """
        训练模型
        """
        X = np.array([self.preprocess_data(data) for data in training_data])
        y = np.array(labels)
        self.model.fit(X, y)
        self.is_trained = True

    def predict(self, activity_data: Dict) -> Dict:
        """
        预测活动类型
        """
        if not self.is_trained:
            raise Exception("Model needs to be trained first")
        
        features = self.preprocess_data(activity_data)
        features = features.reshape(1, -1)
        
        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        confidence = np.max(probabilities)
        
        return {
            "activity_type": prediction,
            "confidence": float(confidence)
        }

    def save_model(self, filepath: str):
        """
        保存模型
        """
        import joblib
        joblib.dump(self.model, filepath)

    def load_model(self, filepath: str):
        """
        加载模型
        """
        import joblib
        self.model = joblib.load(filepath)
        self.is_trained = True 