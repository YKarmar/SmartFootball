"""
足球场尺寸估算 FastAPI 服务
提供基于CNN的热力图分析API
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
import numpy as np
import logging
import base64
import io
from PIL import Image
import torch
from typing import List, Optional, Union
import os
from pathlib import Path
import uvicorn

# 导入我们的模型
from ml_models.field_estimator import FieldEstimator

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建FastAPI应用
app = FastAPI(
    title="足球场尺寸估算API",
    description="基于CNN的足球场热力图分析服务，使用修改版MobileNet-V2估算场地尺寸",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局变量存储模型实例
estimator: Optional[FieldEstimator] = None

# 数据模型定义
class HeatmapArrayRequest(BaseModel):
    """使用数组数据的请求模型"""
    heatmap_data: List[List[float]] = Field(..., description="热力图数据，二维数组")
    
    @validator('heatmap_data')
    def validate_heatmap_data(cls, v):
        if not v or len(v) == 0:
            raise ValueError("热力图数据不能为空")
        
        # 检查是否为矩形
        row_length = len(v[0])
        for row in v:
            if len(row) != row_length:
                raise ValueError("热力图数据必须是矩形数组")
        
        return v


class HeatmapBase64Request(BaseModel):
    """使用Base64编码图像的请求模型"""
    image_base64: str = Field(..., description="Base64编码的热力图图像")
    
    @validator('image_base64')
    def validate_base64(cls, v):
        try:
            # 尝试解码Base64
            if v.startswith('data:image'):
                # 移除data URL前缀
                v = v.split(',')[1]
            base64.b64decode(v)
            return v
        except Exception:
            raise ValueError("无效的Base64编码")


class FieldSizeResponse(BaseModel):
    """场地尺寸响应模型"""
    success: bool = Field(True, description="请求是否成功")
    length: float = Field(..., description="场地长度（米）")
    width: float = Field(..., description="场地宽度（米）")
    confidence: Optional[float] = Field(None, description="预测置信度（如果可用）")
    message: str = Field("预测成功", description="响应消息")


class ErrorResponse(BaseModel):
    """错误响应模型"""
    success: bool = Field(False, description="请求是否成功")
    error: str = Field(..., description="错误信息")
    details: Optional[str] = Field(None, description="详细错误信息")


class ModelInfoResponse(BaseModel):
    """模型信息响应"""
    model_name: str = Field(..., description="模型名称")
    version: str = Field(..., description="模型版本")
    parameters: int = Field(..., description="模型参数数量")
    device: str = Field(..., description="运行设备")
    status: str = Field(..., description="模型状态")


# 启动事件：加载模型
@app.on_event("startup")
async def load_model():
    """应用启动时加载模型"""
    global estimator
    try:
        logger.info("正在加载足球场尺寸估算模型...")
        
        # 设置设备
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        logger.info(f"使用设备: {device}")
        
        # 检查是否有预训练模型
        model_path = os.getenv('MODEL_PATH', 'field_estimator_model.pth')
        if os.path.exists(model_path):
            logger.info(f"加载预训练模型: {model_path}")
            estimator = FieldEstimator(model_path=model_path, device=device)
        else:
            logger.info("未找到预训练模型，使用ImageNet预训练权重初始化")
            estimator = FieldEstimator(device=device)
        
        logger.info("模型加载成功！")
        
    except Exception as e:
        logger.error(f"模型加载失败: {e}")
        estimator = None


# 关闭事件
@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时的清理工作"""
    logger.info("正在关闭服务...")


# API端点定义
@app.get("/", tags=["根目录"])
async def root():
    """根端点"""
    return {"message": "足球场尺寸估算API服务", "status": "运行中", "docs": "/docs"}


@app.get("/health", tags=["健康检查"])
async def health_check():
    """健康检查端点"""
    if estimator is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    return {
        "status": "healthy",
        "model_loaded": estimator is not None,
        "device": estimator.device if estimator else None
    }


@app.get("/info", response_model=ModelInfoResponse, tags=["模型信息"])
async def get_model_info():
    """获取模型信息"""
    if estimator is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    try:
        total_params = sum(p.numel() for p in estimator.model.parameters())
        
        return ModelInfoResponse(
            model_name="Modified MobileNet-V2 Field Estimator",
            version="1.0.0",
            parameters=total_params,
            device=estimator.device,
            status="ready"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取模型信息失败: {str(e)}")


@app.post("/predict/array", response_model=FieldSizeResponse, tags=["预测"])
async def predict_from_array(request: HeatmapArrayRequest):
    """
    使用数组数据预测场地尺寸
    """
    if estimator is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    try:
        # 转换为numpy数组
        heatmap = np.array(request.heatmap_data, dtype=np.float32)
        
        # 验证数据范围
        if heatmap.min() < 0 or heatmap.max() > 1:
            logger.warning("热力图数据超出[0,1]范围，将进行归一化")
            heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
        
        # 进行预测
        length, width = estimator.estimate(heatmap)
        
        logger.info(f"预测结果: 长度={length:.2f}m, 宽度={width:.2f}m")
        
        return FieldSizeResponse(
            length=length,
            width=width,
            message=f"预测成功: {length:.1f}m × {width:.1f}m"
        )
        
    except Exception as e:
        logger.error(f"预测失败: {e}")
        raise HTTPException(status_code=400, detail=f"预测失败: {str(e)}")


@app.post("/predict/image", response_model=FieldSizeResponse, tags=["预测"])
async def predict_from_base64(request: HeatmapBase64Request):
    """
    使用Base64编码的图像预测场地尺寸
    """
    if estimator is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    try:
        # 解码Base64图像
        image_data = request.image_base64
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        # 使用PIL打开图像
        image = Image.open(io.BytesIO(image_bytes))
        
        # 转换为灰度图像（如果不是）
        if image.mode != 'L':
            image = image.convert('L')
        
        # 转换为numpy数组
        heatmap = np.array(image, dtype=np.float32)
        
        # 归一化到[0,1]
        heatmap = heatmap / 255.0
        
        # 进行预测
        length, width = estimator.estimate(heatmap)
        
        logger.info(f"预测结果: 长度={length:.2f}m, 宽度={width:.2f}m")
        
        return FieldSizeResponse(
            length=length,
            width=width,
            message=f"预测成功: {length:.1f}m × {width:.1f}m"
        )
        
    except Exception as e:
        logger.error(f"图像预测失败: {e}")
        raise HTTPException(status_code=400, detail=f"图像预测失败: {str(e)}")


@app.post("/predict/file", response_model=FieldSizeResponse, tags=["预测"])
async def predict_from_file(file: UploadFile = File(...)):
    """
    使用上传的图像文件预测场地尺寸
    """
    if estimator is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    # 验证文件类型
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="必须上传图像文件")
    
    try:
        # 读取文件内容
        contents = await file.read()
        
        # 使用PIL打开图像
        image = Image.open(io.BytesIO(contents))
        
        # 转换为灰度图像（如果不是）
        if image.mode != 'L':
            image = image.convert('L')
        
        # 转换为numpy数组
        heatmap = np.array(image, dtype=np.float32)
        
        # 归一化到[0,1]
        heatmap = heatmap / 255.0
        
        # 进行预测
        length, width = estimator.estimate(heatmap)
        
        logger.info(f"文件预测结果: 长度={length:.2f}m, 宽度={width:.2f}m")
        
        return FieldSizeResponse(
            length=length,
            width=width,
            message=f"预测成功: {length:.1f}m × {width:.1f}m"
        )
        
    except Exception as e:
        logger.error(f"文件预测失败: {e}")
        raise HTTPException(status_code=400, detail=f"文件预测失败: {str(e)}")


# 异常处理器
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP异常处理器"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=str(exc.detail),
            details=f"请求路径: {request.url.path}"
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """通用异常处理器"""
    logger.error(f"未处理的异常: {exc}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="内部服务器错误",
            details=str(exc)
        ).dict()
    )


# 开发服务器启动函数
def start_server(host: str = "0.0.0.0", port: int = 8001, reload: bool = False):
    """启动开发服务器"""
    uvicorn.run(
        "field_estimator_api:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )


if __name__ == "__main__":
    start_server(reload=True) 