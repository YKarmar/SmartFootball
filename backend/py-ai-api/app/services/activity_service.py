import logging
from typing import Dict, Any, List

import httpx
from ..schemas.activity import ActivityCreate, ActivityOut, ActivityUpdate

logger = logging.getLogger(__name__)
BASE_URL = "http://java-backend:8080/api/activities"

async def create_activity(payload: ActivityCreate) -> ActivityOut:
    data = payload.dict(by_alias=True)
    logger.debug("Calling Java API CREATE_ACTIVITY POST %s with payload: %s",
                 BASE_URL, data)

    async with httpx.AsyncClient() as client:
        resp = await client.post(BASE_URL, json=data)

    logger.info("CREATE_ACTIVITY status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "CREATE_ACTIVITY failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("CREATE_ACTIVITY response body: %s", result)
    return ActivityOut.parse_obj(result)


async def get_activity(activity_id: str) -> ActivityOut:
    url = f"{BASE_URL}/{activity_id}"
    logger.debug("Calling Java API GET_ACTIVITY GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_ACTIVITY status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ACTIVITY failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ACTIVITY response body: %s", result)
    return ActivityOut.parse_obj(result)

async def update_activity(activity_id: str, payload: ActivityUpdate) -> ActivityOut:
    url = f"{BASE_URL}/{activity_id}"
    logger.debug("Calling Java API UPDATE_ACTIVITY PUT %s with payload: %s",
                 url, payload.dict(by_alias=True))

    async with httpx.AsyncClient() as client:
        resp = await client.put(url, json=payload.dict(by_alias=True))

    logger.info("UPDATE_ACTIVITY status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "UPDATE_ACTIVITY failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("UPDATE_ACTIVITY response body: %s", result)
    return ActivityOut.parse_obj(result)

async def delete_activity(activity_id: str) -> None:
    url = f"{BASE_URL}/{activity_id}"
    logger.debug("Calling Java API DELETE_ACTIVITY DELETE %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.delete(url)

    logger.info("DELETE_ACTIVITY status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "DELETE_ACTIVITY failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    return None

async def get_all_activities() -> List[ActivityOut]:
    url = f"{BASE_URL}"
    logger.debug("Calling Java API GET_ALL_ACTIVITIES GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_ALL_ACTIVITIES status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ALL_ACTIVITIES failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ALL_ACTIVITIES response body: %s", result)
    return [ActivityOut.parse_obj(activity) for activity in result]


async def get_activities_by_user(user_id: str) -> List[ActivityOut]:
    url = f"{BASE_URL}/user/{user_id}"
    logger.debug("Calling Java API GET_ACTIVITIES_BY_USER GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_ACTIVITIES_BY_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ACTIVITIES_BY_USER failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ACTIVITIES_BY_USER response body: %s", result)
    return [ActivityOut.parse_obj(activity) for activity in result]

async def get_activities_by_user_and_range(user_id: str, from_time: str, to_time: str) -> List[ActivityOut]:
    url = f"{BASE_URL}/user/{user_id}/range"
    logger.debug("Calling Java API GET_ACTIVITIES_BY_USER_AND_RANGE GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_ACTIVITIES_BY_USER_AND_RANGE status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ACTIVITIES_BY_USER_AND_RANGE failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ACTIVITIES_BY_USER_AND_RANGE response body: %s", result)
    return [ActivityOut.parse_obj(activity) for activity in result]

async def get_activities_by_user_and_type(user_id: str, activity_type: str) -> List[ActivityOut]:
    url = f"{BASE_URL}/user/{user_id}/type/{activity_type}"
    logger.debug("Calling Java API GET_ACTIVITIES_BY_USER_AND_TYPE GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_ACTIVITIES_BY_USER_AND_TYPE status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ACTIVITIES_BY_USER_AND_TYPE failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ACTIVITIES_BY_USER_AND_TYPE response body: %s", result)
    return [ActivityOut.parse_obj(activity) for activity in result]
