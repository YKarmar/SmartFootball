# SmartSoccer AI 后端

这是SmartSoccer应用的AI后端服务，提供活动检测、场地估计、热力图生成和智能对话等功能。

## 功能特点

- 活动检测：使用机器学习模型识别足球活动
- 场地边界估计：基于GPS数据估计足球场边界
- 热力图生成：生成活动热力图并分析覆盖情况
- 智能对话：基于LLM的对话助手，提供个性化建议

## 环境要求

- Python 3.8+
- pip
- 虚拟环境（推荐）

## 安装步骤

1. 创建并激活虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
.\venv\Scripts\activate  # Windows
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置信息
```

## 运行服务

```bash
python api/main.py
```

服务将在 http://localhost:8000 启动，可以通过 http://localhost:8000/docs 访问API文档。

## API端点

- POST /detect-activity：检测活动类型
- POST /estimate-field：估计场地边界
- POST /generate-heatmap：生成热力图
- POST /analyze-activity：分析活动数据

## 模型训练

1. 准备训练数据
2. 运行训练脚本：
```bash
python scripts/train_models.py
```

## 目录结构

```
.
├── api/            # FastAPI应用
├── models/         # 机器学习模型
├── utils/          # 工具函数
├── data/           # 数据目录
├── scripts/        # 训练脚本
└── tests/          # 测试文件
```

## 开发指南

1. 遵循PEP 8编码规范
2. 为新功能编写测试
3. 使用类型注解
4. 编写详细的文档字符串

## 测试

运行测试：
```bash
pytest
```

## 部署

1. 准备生产环境配置
2. 设置环境变量
3. 使用生产级WSGI服务器（如Gunicorn）运行服务

## 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT 