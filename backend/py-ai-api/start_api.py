#!/usr/bin/env python3
"""
足球场尺寸估算API启动脚本
"""

import os
import sys
import argparse
from pathlib import Path

# 添加当前目录到Python路径
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from field_estimator_api import start_server


def main():
    parser = argparse.ArgumentParser(description='启动足球场尺寸估算API服务')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='服务器主机地址')
    parser.add_argument('--port', type=int, default=8001, help='服务器端口')
    parser.add_argument('--reload', action='store_true', help='启用热重载（开发模式）')
    parser.add_argument('--workers', type=int, default=1, help='工作进程数量')
    parser.add_argument('--model-path', type=str, help='预训练模型路径')
    
    args = parser.parse_args()
    
    # 设置环境变量
    if args.model_path:
        os.environ['MODEL_PATH'] = args.model_path
    
    print(f"🚀 启动足球场尺寸估算API服务...")
    print(f"📍 地址: http://{args.host}:{args.port}")
    print(f"📚 API文档: http://{args.host}:{args.port}/docs")
    print(f"🔄 热重载: {'启用' if args.reload else '禁用'}")
    
    if args.model_path:
        print(f"🤖 模型路径: {args.model_path}")
    
    # 启动服务器
    start_server(
        host=args.host,
        port=args.port,
        reload=args.reload
    )


if __name__ == "__main__":
    main() 