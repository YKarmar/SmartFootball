import os, glob
import pandas as pd

INPUT_DIR  = 'player_positions'
OUTPUT_DIR = 'dataset_scaled'
os.makedirs(OUTPUT_DIR, exist_ok=True)

FIELD_SIZES = {
    '11v11': (105.0, 68.0),
    '8v8':   (80.0, 50.0),
    '5v5':   (40.0, 20.0),
}

# 收集所有缩放后的 DataFrame
all_dfs = []
csv_paths = glob.glob(os.path.join(INPUT_DIR, 'Player*.csv'))
if not csv_paths:
    raise FileNotFoundError(f"在目录 '{INPUT_DIR}' 中未找到任何 Player*.csv，请检查文件路径和命名。")

for csv_path in csv_paths:
    player_name = os.path.splitext(os.path.basename(csv_path))[0]
    df_norm = pd.read_csv(csv_path)  # 应包含列：time, x, y, 其它可选列
    
    for field_type, (length_m, width_m) in FIELD_SIZES.items():
        df_scaled = df_norm.copy()
        df_scaled['x_m'] = df_scaled['x'] * length_m
        df_scaled['y_m'] = df_scaled['y'] * width_m
        df_scaled['field_length_m'] = length_m
        df_scaled['field_width_m'] = width_m
        df_scaled['field_type'] = field_type
        df_scaled['player'] = player_name
        all_dfs.append(df_scaled)

# 确保有数据可以合并
if not all_dfs:
    raise ValueError("尽管找到了输入文件，但没有生成任何缩放数据，请检查输入 CSV 是否包含 x,y 列。")

df_all = pd.concat(all_dfs, ignore_index=True)
output_path = os.path.join(OUTPUT_DIR, 'positions_scaled_all.csv')
df_all.to_csv(output_path, index=False)
print(f"✅ 成功生成合并数据集，共 {len(df_all)} 条记录 → {output_path}")
