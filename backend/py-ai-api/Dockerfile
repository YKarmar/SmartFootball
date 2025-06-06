# 使用Python 3.9作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制requirements文件
COPY requirements_fastapi.txt .
COPY requirements_field_estimator.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements_fastapi.txt
RUN pip install --no-cache-dir -r requirements_field_estimator.txt

# 复制应用代码
COPY . .

# 创建模型目录
RUN mkdir -p /app/models

# 暴露端口
EXPOSE 8001

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# 启动命令
CMD ["python", "start_api.py", "--host", "0.0.0.0", "--port", "8001"] 