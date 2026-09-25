import asyncio
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    applications_router,
    auth_router,
    companies_router,
    job_posts_router,
)
app = FastAPI(
    title="Application Tracker API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    applications_router,
    prefix="/api/v1/applications",
    tags=["applications"],
)

app.include_router(
    companies_router,
    prefix="/api/v1/companies",
    tags=["companies"],
)

app.include_router(
    job_posts_router,
    prefix="/api/v1/job-posts",
    tags=["job-posts"],
)

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["auth"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Application Tracker API!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}