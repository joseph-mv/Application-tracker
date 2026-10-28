from datetime import date, datetime, time
from decimal import Decimal
import enum
from re import Pattern
from types import UnionType
from typing import Any, Union, get_args, get_origin

from pydantic import AnyUrl, EmailStr
from pydantic.fields import FieldInfo

CONSTRAINT_KEYS = (
    "min_length",
    "max_length",
    "ge",
    "gt",
    "le",
    "lt",
    "multiple_of",
    "max_digits",
    "decimal_places",
    "pattern",
)


def unwrap_annotation(annotation: object) -> object:
    origin = get_origin(annotation)
    if origin in (Union, UnionType):
        args = [arg for arg in get_args(annotation) if arg is not type(None)]
        if len(args) == 1:
            return args[0]
    return annotation


def field_type_name(annotation: object) -> str:
    inner = unwrap_annotation(annotation)
    if inner is str:
        return "string"
    if inner is AnyUrl:
        return "url"
    if inner is EmailStr:
        return "email"
    if inner is Decimal:
        return "decimal"
    if inner is int:
        return "integer"
    if inner is float:
        return "float"
    if inner is bool:
        return "boolean"
    if inner is datetime:
        return "datetime"
    if inner is date:
        return "date"
    if inner is time:
        return "time"
    if isinstance(inner, type) and issubclass(inner, enum.Enum):
        return "enum"
    return getattr(inner, "__name__", str(inner)).lower()


def _constraint_value(value: object) -> object:
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, Pattern):
        return value.pattern
    return value


def field_constraints(info: FieldInfo) -> dict[str, Any]:
    constraints: dict[str, Any] = {}
    for item in info.metadata:
        for key in CONSTRAINT_KEYS:
            if hasattr(item, key):
                value = getattr(item, key)
                if value is not None:
                    constraints[key] = _constraint_value(value)

    inner = unwrap_annotation(info.annotation)
    if isinstance(inner, type) and issubclass(inner, enum.Enum):
        constraints["enum"] = [member.value for member in inner]
    return constraints
