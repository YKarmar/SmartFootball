import logging
from typing import Dict, Any, List

import httpx
from ..schemas.recommendation import RecommendationCreate, RecommendationUpdate, RecommendationOut

BASE_URL = "http://java-backend:8080/api/recommendations"

logger = logging.getLogger(__name__)

async def create_recommendation(payload: RecommendationCreate) -> RecommendationOut:
    data = payload.dict(by_alias=True)
    logger.debug("Calling Java API CREATE_RECOMMENDATION POST %s with payload: %s",
                 BASE_URL, data)

    async with httpx.AsyncClient() as client:
        resp = await client.post(BASE_URL, json=data)

    logger.info("CREATE_RECOMMENDATION status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "CREATE_RECOMMENDATION failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("CREATE_RECOMMENDATION response body: %s", result)
    return RecommendationOut.parse_obj(result)


async def get_recommendation(recommendation_id: str) -> RecommendationOut:
    url = f"{BASE_URL}/{recommendation_id}"
    logger.debug("Calling Java API GET_RECOMMENDATION GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_RECOMMENDATION status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_RECOMMENDATION failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_RECOMMENDATION response body: %s", result)
    return RecommendationOut.parse_obj(result)


async def update_recommendation(recommendation_id: str, payload: RecommendationUpdate) -> RecommendationOut:
    url = f"{BASE_URL}/{recommendation_id}"
    logger.debug("Calling Java API UPDATE_RECOMMENDATION PUT %s with payload: %s",
                 url, payload.dict(by_alias=True))

    async with httpx.AsyncClient() as client:
        resp = await client.put(url, json=payload.dict(by_alias=True))

    logger.info("UPDATE_RECOMMENDATION status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "UPDATE_RECOMMENDATION failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("UPDATE_RECOMMENDATION response body: %s", result)
    return RecommendationOut.parse_obj(result)  

async def delete_recommendation(recommendation_id: str) -> None:
    url = f"{BASE_URL}/{recommendation_id}"
    logger.debug("Calling Java API DELETE_RECOMMENDATION DELETE %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.delete(url)

    logger.info("DELETE_RECOMMENDATION status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "DELETE_RECOMMENDATION failed: %s %s",
          resp.status_code, resp.text
        )   
        resp.raise_for_status()

    return None

async def get_all_recommendations() -> List[RecommendationOut]:
    url = f"{BASE_URL}"
    logger.debug("Calling Java API GET_ALL_RECOMMENDATIONS GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_ALL_RECOMMENDATIONS status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ALL_RECOMMENDATIONS failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ALL_RECOMMENDATIONS response body: %s", result)
    return [RecommendationOut.parse_obj(recommendation) for recommendation in result]

async def get_recommendations_by_user(user_id: str) -> List[RecommendationOut]:
    url = f"{BASE_URL}/user/{user_id}"
    logger.debug("Calling Java API GET_RECOMMENDATIONS_BY_USER GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_RECOMMENDATIONS_BY_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_RECOMMENDATIONS_BY_USER failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_RECOMMENDATIONS_BY_USER response body: %s", result)
    return [RecommendationOut.parse_obj(recommendation) for recommendation in result]

async def get_recommendations_by_user_and_type(user_id: str, recommendation_type: str) -> List[RecommendationOut]:
    url = f"{BASE_URL}/user/{user_id}/type/{recommendation_type}"
    logger.debug("Calling Java API GET_RECOMMENDATIONS_BY_USER_AND_TYPE GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_RECOMMENDATIONS_BY_USER_AND_TYPE status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_RECOMMENDATIONS_BY_USER_AND_TYPE failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_RECOMMENDATIONS_BY_USER_AND_TYPE response body: %s", result)
    return [RecommendationOut.parse_obj(recommendation) for recommendation in result]

async def get_recommendations_by_user_and_range(user_id: str, from_time: str, to_time: str) -> List[RecommendationOut]:
    url = f"{BASE_URL}/user/{user_id}/range"
    logger.debug("Calling Java API GET_RECOMMENDATIONS_BY_USER_AND_RANGE GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_RECOMMENDATIONS_BY_USER_AND_RANGE status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_RECOMMENDATIONS_BY_USER_AND_RANGE failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_RECOMMENDATIONS_BY_USER_AND_RANGE response body: %s", result)
    return [RecommendationOut.parse_obj(recommendation) for recommendation in result]

