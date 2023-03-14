from typing import Dict, TypedDict


class MessageJson(TypedDict):
    module: str
    action: str
    payload: str | Dict


class RequestTaskJson(TypedDict):
    walletaddress: str
    txId: str
    messageHash: str
    message: MessageJson
