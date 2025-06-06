import pandas as pd
import os

# 输入文件名
INPUT_CSV = './Sample_Game_1_RawEventsData.csv'
# 输出目录（如果不存在则创建）
OUTPUT_DIR = 'player_positions'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. 读取原始数据
df = pd.read_csv(INPUT_CSV)

# 2. 丢弃同时在 Start X, Start Y, End X, End Y 全为空的行
df = df.dropna(subset=['Start X', 'Start Y', 'End X', 'End Y'], how='all')

# 3. 展开起点和终点
start_df = (
    df[['From', 'Start Time [s]', 'Start X', 'Start Y']]
    .rename(columns={
        'From': 'player',
        'Start Time [s]': 'time',
        'Start X': 'x',
        'Start Y': 'y'
    })
)

end_df = (
    df[['To', 'End Time [s]', 'End X', 'End Y']]
    .rename(columns={
        'To': 'player',
        'End Time [s]': 'time',
        'End X': 'x',
        'End Y': 'y'
    })
)

# 4. 合并并清洗
pos_df = pd.concat([start_df, end_df], ignore_index=True)
pos_df = pos_df.dropna(subset=['player', 'x', 'y']).reset_index(drop=True)

# 5. 为每个 player 写出单独 CSV
for player, grp in pos_df.groupby('player'):
    # 按时间排序（可选）
    grp = grp.sort_values('time')
    # 只保留三列
    out_df = grp[['time', 'x', 'y']].reset_index(drop=True)
    # 将斜杠等非法文件名字符替换掉
    safe_name = player.replace('/', '_').replace('\\', '_')
    out_path = os.path.join(OUTPUT_DIR, f"{safe_name}.csv")
    out_df.to_csv(out_path, index=False)
    print(f"Saved {len(out_df)} records → {out_path}")
