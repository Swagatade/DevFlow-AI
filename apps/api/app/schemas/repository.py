from pydantic import BaseModel, ConfigDict, Field


class RepositoryAnalyzeRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    repo_url: str = Field(..., min_length=8, max_length=500, alias="repoUrl")
    model: str | None = Field(default=None, max_length=120)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000)
    model: str | None = Field(default=None, max_length=120)


class DebugRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    error_log: str | None = Field(default=None, max_length=20000, alias="errorLog")
    model: str | None = Field(default=None, max_length=120)
