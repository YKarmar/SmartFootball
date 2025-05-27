import numpy as np
import pandas as pd

class FieldSimulator:
    # 预定义常见场地尺寸（单位：米）
    FIELD_SIZES = {
        '5v5':   (40,  20),
        '7v7':   (60,  40),
        '11v11': (105, 68),
    }

    # 各位置典型活动区域（x_min,x_max）、(y_min,y_max) 相对于场地左下角
    ROLE_ZONES = {
        'LB': ((0.0, 30.0), (45.0, 68.0)),     # 左边后卫
        'RB': ((0.0, 30.0), (0.0, 23.0)),      # 右边后卫
        'CB': ((0.0, 40.0), (20.0, 48.0)),     # 中后卫
        'LM': ((30.0, 75.0), (45.0, 68.0)),    # 左中场
        'RM': ((30.0, 75.0), (0.0, 23.0)),     # 右中场
        'CM': ((30.0, 75.0), (20.0, 48.0)),    # 中前卫
        'LW': ((60.0,105.0), (45.0, 68.0)),    # 左边锋
        'RW': ((60.0,105.0), (0.0, 23.0)),     # 右边锋
        'ST': ((70.0,105.0), (20.0, 48.0)),    # 前锋
    }

    def __init__(self,
                 roles: list[str],
                 field_size: str | tuple[float,float] = '11v11',
                 duration: float = 600,
                 dt: float = 1.0,
                 noise_std: float = 2.5):
        """
        roles:     球员位置列表，元素如 'GK','LB','CB','CM','ST','LW' 等
        field_size: '5v5'/'7v7'/'11v11' 或 自定义 (length, width) 米
        duration:  模拟总时长（秒）
        dt:        时间步长（秒）
        noise_std: GPS 噪声标准差（米）
        """
        # 解析场地大小
        if isinstance(field_size, str):
            self.field_length, self.field_width = self.FIELD_SIZES[field_size]
        else:
            self.field_length, self.field_width = field_size

        self.roles = roles
        self.n_players = len(roles)
        self.duration = duration
        self.dt = dt
        self.noise_std = noise_std

        # 初始化玩家起始位置
        self.positions = self._init_positions()

    def _init_positions(self) -> np.ndarray:
        pts = []
        for role in self.roles:
            if role not in self.ROLE_ZONES:
                # 如果未知位置，则在全场随机
                x = np.random.uniform(0, self.field_length)
                y = np.random.uniform(0, self.field_width)
            else:
                (xmin, xmax), (ymin, ymax) = self.ROLE_ZONES[role]
                # 将百分比区域映射到实际大小
                # 这里 ROLE_ZONES 中数值按 0-105 / 0-68 的绝对值给出
                x = np.random.uniform(xmin, xmax)
                y = np.random.uniform(ymin, ymax)
            pts.append([x, y])
        return np.array(pts)

    def _step(self, positions: np.ndarray) -> np.ndarray:
        # 简单随机游走 + 回到场中心的吸引力
        center = np.array([self.field_length/2, self.field_width/2])
        new_pos = []
        for pos in positions:
            center_force = (center - pos) * 0.01
            vel = np.random.randn(2)*1.0 + center_force
            p = pos + vel * self.dt
            # 保证不出界
            p[0] = np.clip(p[0], 0, self.field_length)
            p[1] = np.clip(p[1], 0, self.field_width)
            new_pos.append(p)
        return np.array(new_pos)

    def simulate(self, add_noise: bool = True) -> pd.DataFrame:
        """
        生成并返回一个 DataFrame，包含: time, x, y, player_id, role
        """
        traces = [[] for _ in range(self.n_players)]
        positions = self.positions.copy()

        for t in np.arange(0, self.duration, self.dt):
            # 记录当前位置
            for pid, pos in enumerate(positions):
                traces[pid].append([t, pos[0], pos[1]])
            # 计算下一步
            positions = self._step(positions)

        # 可选：添加 GPS 噪声
        if add_noise:
            for pid in range(self.n_players):
                for row in traces[pid]:
                    row[1] += np.random.normal(0, self.noise_std)
                    row[2] += np.random.normal(0, self.noise_std)

        # 拼成 DataFrame
        records = []
        for pid, role in enumerate(self.roles):
            for t, x, y in traces[pid]:
                records.append({
                    'time':      t,
                    'x':         x,
                    'y':         y,
                    'player_id': pid,
                    'role':      role
                })
        df = pd.DataFrame(records)
        return df

    def save_csv(self, df: pd.DataFrame, filename: str):
        df.to_csv(filename, index=False)
