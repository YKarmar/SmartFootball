import os
from typing import List, Dict, Optional
import openai
from dotenv import load_dotenv

class LLMAssistant:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        openai.api_key = self.api_key
        self.model = "gpt-3.5-turbo"  # 或使用其他模型

    def generate_response(self, 
                         query: str, 
                         activity_data: Optional[Dict] = None,
                         historical_data: Optional[List[Dict]] = None) -> Dict:
        """
        生成对话响应
        """
        # 构建系统提示
        system_prompt = """你是一个专业的足球数据分析助手。你可以帮助用户分析他们的足球活动数据，
        包括位置覆盖、跑动距离、心率变化等。请用专业但易懂的语言回答用户的问题。"""

        # 构建上下文信息
        context = ""
        if activity_data:
            context += f"\n当前活动数据：\n"
            if 'heatmap_data' in activity_data:
                context += f"- 热力图数据点数量：{len(activity_data['heatmap_data'])}\n"
            if 'field_boundary' in activity_data:
                context += f"- 场地边界点数量：{len(activity_data['field_boundary'])}\n"
            if 'stats' in activity_data:
                context += f"- 活动统计：{activity_data['stats']}\n"

        if historical_data:
            context += f"\n历史活动数据：\n"
            context += f"- 总活动次数：{len(historical_data)}\n"
            if historical_data:
                recent_activity = historical_data[-1]
                context += f"- 最近活动时间：{recent_activity.get('start_time', 'N/A')}\n"

        # 构建用户提示
        user_prompt = f"{context}\n\n用户问题：{query}"

        try:
            # 调用OpenAI API
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )

            return {
                "response": response.choices[0].message.content,
                "confidence": 0.9  # 可以根据需要调整
            }

        except Exception as e:
            return {
                "response": f"抱歉，处理您的问题时出现错误：{str(e)}",
                "confidence": 0.0
            }

    def analyze_trends(self, historical_data: List[Dict]) -> Dict:
        """
        分析历史数据趋势
        """
        if not historical_data:
            return {
                "response": "没有足够的历史数据进行分析",
                "confidence": 0.0
            }

        # 构建分析提示
        analysis_prompt = f"""请分析以下足球活动历史数据，并提供趋势分析：
        总活动次数：{len(historical_data)}
        时间范围：从 {historical_data[0].get('start_time', 'N/A')} 到 {historical_data[-1].get('start_time', 'N/A')}
        """

        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的足球数据分析师，请分析数据趋势并提供有价值的见解。"},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )

            return {
                "analysis": response.choices[0].message.content,
                "confidence": 0.9
            }

        except Exception as e:
            return {
                "analysis": f"分析历史数据时出现错误：{str(e)}",
                "confidence": 0.0
            }

    def generate_suggestions(self, activity_data: Dict) -> Dict:
        """
        生成个性化建议
        """
        if not activity_data:
            return {
                "suggestions": ["没有活动数据可供分析"],
                "confidence": 0.0
            }

        # 构建建议提示
        suggestion_prompt = f"""基于以下活动数据，请提供具体的改进建议：
        活动类型：{activity_data.get('activity_type', 'N/A')}
        活动时长：{activity_data.get('duration', 'N/A')}
        覆盖区域：{activity_data.get('coverage_area', 'N/A')}
        """

        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的足球教练，请提供具体可行的改进建议。"},
                    {"role": "user", "content": suggestion_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )

            return {
                "suggestions": response.choices[0].message.content.split('\n'),
                "confidence": 0.9
            }

        except Exception as e:
            return {
                "suggestions": [f"生成建议时出现错误：{str(e)}"],
                "confidence": 0.0
            } 