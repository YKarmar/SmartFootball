import os
import glob
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

# Configuration
INPUT_DIR      = 'player_positions'
OUTPUT_DIR     = 'heatmaps_all'
FIELD_LENGTH   = 105.0  # meters
FIELD_WIDTH    =  68.0  # meters
GRID_SIZE      = (100, 68)  # (x bins, y bins)
GAUSSIAN_SIGMA = 2      # smoothing

os.makedirs(OUTPUT_DIR, exist_ok=True)

def make_heatmap(x, y, field_length, field_width, grid_size, sigma):
    x_bins, y_bins = grid_size
    x_edges = np.linspace(0, field_length, x_bins + 1)
    y_edges = np.linspace(0, field_width,  y_bins + 1)
    heat, _, _ = np.histogram2d(x, y, bins=[x_edges, y_edges])
    heat_smooth = gaussian_filter(heat, sigma=sigma)
    extent = [0, field_length, 0, field_width]
    return heat_smooth.T, extent

def plot_and_save(heat, extent, title, out_path):
    plt.figure(figsize=(6, 4))
    plt.imshow(heat, extent=extent, origin='lower', aspect='auto')
    plt.colorbar(label='Density')
    plt.title(title)
    plt.xlabel('X (m)')
    plt.ylabel('Y (m)')
    plt.tight_layout()
    plt.savefig(out_path, dpi=150)
    plt.close()

# Process all Player CSVs
for csv_file in glob.glob(os.path.join(INPUT_DIR, 'Player*.csv')):
    player_name = os.path.splitext(os.path.basename(csv_file))[0]
    df = pd.read_csv(csv_file)
    # Expect normalized x,y in [0,1]
    x = df['x'].values * FIELD_LENGTH
    y = df['y'].values * FIELD_WIDTH

    heat, extent = make_heatmap(
        x, y,
        field_length=FIELD_LENGTH,
        field_width=FIELD_WIDTH,
        grid_size=GRID_SIZE,
        sigma=GAUSSIAN_SIGMA
    )

    out_path = os.path.join(OUTPUT_DIR, f'{player_name}_heatmap.png')
    plot_and_save(heat, extent, f'{player_name} Heatmap', out_path)
    print(f"Generated heatmap for {player_name}: {out_path}")
