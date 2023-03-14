import json
from typing import Optional
from solana.rpc.api import Client
from solana.rpc.types import TokenAccountOpts
from solders.pubkey import Pubkey
from solders.signature import Signature
from flask import current_app


MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"


def get_solana_client():
    return Client(current_app.config["SOLANA_RPC_ENDPOINT"])


def verify_solana_memo_tx(
    tx_id: str,
    user_wallet: str,
    message_hash: str
) -> Optional[str]:
    solana_client = get_solana_client()
    resp = solana_client.get_transaction(
        tx_sig=Signature.from_string(tx_id),
        encoding="jsonParsed"
    ).value

    # TODO: verify tx succeeded
    if resp is None or resp.transaction is None:
        return 'Transation not found'

    resp_json = json.loads(resp.transaction.to_json())
    message_json = resp_json['transaction']['message']
    accounts = message_json['accountKeys']

    if len(accounts) < 2:
        return 'Transaction missing required accounts'

    # verify user is tx signer
    if accounts[0]['pubkey'] != user_wallet:
        return 'It looks like someone else signed this transaction'

    # verify tx is memo
    program_id = message_json['instructions'][0]['programId']
    if (
        accounts[1]['pubkey'] != MEMO_PROGRAM_ID
        or program_id != MEMO_PROGRAM_ID
    ):
        return 'It looks like this transaction is missing a memo'

    # Find memo within tx log messages
    log_messages = resp_json['meta']['logMessages']
    onchain_memo_log = log_messages[2]
    onchain_memo_parts = onchain_memo_log.split(": ")
    if len(onchain_memo_parts) < 3:
        return 'Unable to parse memo'

    onchain_memo_hash = onchain_memo_parts[2].replace('"', '')

    # verify tx memo matches message hash
    if onchain_memo_hash != message_hash:
        return 'On-chain hash does not match memo'

    return None
