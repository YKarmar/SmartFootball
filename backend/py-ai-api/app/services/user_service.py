# app/services/user_client.py
import logging
from typing import Any, Dict, List

import httpx
from ..schemas.user import UserCreate, UserOut, UserUpdate

logger = logging.getLogger(__name__)
BASE_URL = "http://java-backend:8080/api/users"


async def create_user(payload: UserCreate) -> UserOut:
    data = payload.dict(by_alias=True)
    logger.debug("Calling Java API CREATE_USER POST %s with payload: %s",
                 BASE_URL, data)
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(BASE_URL, json=data)

    logger.info("CREATE_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "CREATE_USER failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("CREATE_USER response body: %s", result)
    return UserOut.parse_obj(result)


async def get_user(user_id: str) -> UserOut:
    url = f"{BASE_URL}/{user_id}"
    logger.debug("Calling Java API GET_USER GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_USER failed: %s %s", resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_USER response body: %s", result)
    return UserOut.parse_obj(result)

async def update_user(user_id: str, payload: UserUpdate) -> UserOut:
    url = f"{BASE_URL}/{user_id}"
    logger.debug("Calling Java API UPDATE_USER PUT %s with payload: %s",
                 url, payload.dict(by_alias=True))

    async with httpx.AsyncClient() as client:
        resp = await client.put(url, json=payload.dict(by_alias=True))

    logger.info("UPDATE_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "UPDATE_USER failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("UPDATE_USER response body: %s", result)
    return UserOut.parse_obj(result)   

async def delete_user(user_id: str) -> None:
    url = f"{BASE_URL}/{user_id}"
    logger.debug("Calling Java API DELETE_USER DELETE %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.delete(url)

    logger.info("DELETE_USER status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "DELETE_USER failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    return None

async def get_user_by_email(email: str) -> UserOut:
    url = f"{BASE_URL}/email/{email}"
    logger.debug("Calling Java API GET_USER_BY_EMAIL GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_USER_BY_EMAIL status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_USER_BY_EMAIL failed: %s %s",
          resp.status_code, resp.text
        ) 
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_USER_BY_EMAIL response body: %s", result)
    return UserOut.parse_obj(result)

async def get_user_by_username(username: str) -> UserOut:
    url = f"{BASE_URL}/username/{username}"
    logger.debug("Calling Java API GET_USER_BY_USERNAME GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_USER_BY_USERNAME status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_USER_BY_USERNAME failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()
    
    result = resp.json()
    logger.debug("GET_USER_BY_USERNAME response body: %s", result)
    return UserOut.parse_obj(result)

async def get_all_users() -> List[UserOut]:
    url = f"{BASE_URL}"
    logger.debug("Calling Java API GET_ALL_USERS GET %s", url)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    logger.info("GET_ALL_USERS status: %s", resp.status_code)
    if resp.is_error:
        logger.error(
          "GET_ALL_USERS failed: %s %s",
          resp.status_code, resp.text
        )
        resp.raise_for_status()

    result = resp.json()
    logger.debug("GET_ALL_USERS response body: %s", result)
    return [UserOut.parse_obj(user) for user in result]
