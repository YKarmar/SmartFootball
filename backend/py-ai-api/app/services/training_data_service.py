import logging
from typing import Dict, Any, List

import httpx
from ..schemas.training_data import TrainingDataCreate, TrainingDataOut, TrainingDataUpdate

logger = logging.getLogger(__name__)
BASE_URL = "http://java-backend:8080/api/training_data"

async def create_training_data(payload: TrainingDataCreate) -> TrainingDataOut:
    data = payload.dict(by_alias=True)
    logger.debug("Calling Java API CREATE_TRAINING_DATA POST %s with payload: %s",
                 BASE_URL, data)

    async with httpx.AsyncClient() as client:
        resp = await client.post(BASE_URL, json=data)

    logger.info("CREATE_TRAINING_DATA status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "CREATE_TRAINING_DATA failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("CREATE_TRAINING_DATA response body: %s", result)
    return TrainingDataOut.parse_obj(result)

async def get_training_data(training_data_id: str) -> TrainingDataOut:
    url = f"{BASE_URL}/{training_data_id}"
    logger.debug("Calling Java API GET_TRAINING_DATA GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_TRAINING_DATA status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_TRAINING_DATA failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_TRAINING_DATA response body: %s", result)
    return TrainingDataOut.parse_obj(result)

async def update_training_data(training_data_id: str, payload: TrainingDataUpdate) -> TrainingDataOut:
    url = f"{BASE_URL}/{training_data_id}"
    logger.debug("Calling Java API UPDATE_TRAINING_DATA PUT %s with payload: %s",
                 url, payload.dict(by_alias=True))

    async with httpx.AsyncClient() as client:
        resp = await client.put(url, json=payload.dict(by_alias=True))

    logger.info("UPDATE_TRAINING_DATA status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "UPDATE_TRAINING_DATA failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("UPDATE_TRAINING_DATA response body: %s", result)
    return TrainingDataOut.parse_obj(result)

async def delete_training_data(training_data_id: str) -> None:
    url = f"{BASE_URL}/{training_data_id}"
    logger.debug("Calling Java API DELETE_TRAINING_DATA DELETE %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.delete(url)

    logger.info("DELETE_TRAINING_DATA status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "DELETE_TRAINING_DATA failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    return None

async def get_all_training_data() -> List[TrainingDataOut]:
    url = f"{BASE_URL}"
    logger.debug("Calling Java API GET_ALL_TRAINING_DATA GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_ALL_TRAINING_DATA status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ALL_TRAINING_DATA failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ALL_TRAINING_DATA response body: %s", result)
    return [TrainingDataOut.parse_obj(training_data) for training_data in result]

async def get_training_data_by_user(user_id: str) -> List[TrainingDataOut]:
    url = f"{BASE_URL}/user/{user_id}"
    logger.debug("Calling Java API GET_TRAINING_DATA_BY_USER GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_TRAINING_DATA_BY_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_TRAINING_DATA_BY_USER failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_TRAINING_DATA_BY_USER response body: %s", result)
    return [TrainingDataOut.parse_obj(training_data) for training_data in result]

async def get_training_data_by_user_and_range(user_id: str, from_time: str, to_time: str) -> List[TrainingDataOut]:
    url = f"{BASE_URL}/user/{user_id}/range"
    logger.debug("Calling Java API GET_TRAINING_DATA_BY_USER_AND_RANGE GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_TRAINING_DATA_BY_USER_AND_RANGE status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_TRAINING_DATA_BY_USER_AND_RANGE failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_TRAINING_DATA_BY_USER_AND_RANGE response body: %s", result)
    return [TrainingDataOut.parse_obj(training_data) for training_data in result]

async def get_training_data_by_user_and_type(user_id: str, activity_type: str) -> List[TrainingDataOut]:
    url = f"{BASE_URL}/user/{user_id}/type/{activity_type}"
    logger.debug("Calling Java API GET_TRAINING_DATA_BY_USER_AND_TYPE GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    logger.info("GET_TRAINING_DATA_BY_USER_AND_TYPE status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_TRAINING_DATA_BY_USER_AND_TYPE failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_TRAINING_DATA_BY_USER_AND_TYPE response body: %s", result)
    return [TrainingDataOut.parse_obj(training_data) for training_data in result]
