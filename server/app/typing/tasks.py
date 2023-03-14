from typing import Dict, List, TypedDict


class TaskResponse(object):
    success: bool
    errors: List[str]
    data: Dict

    def __init__(self, success: bool, errors: List[str], resp: Dict):
        self.success = success
        self.errors = errors
        self.data = resp
