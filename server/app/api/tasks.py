import hashlib
import json
from flask import request, jsonify
from app.api import api
from app.utils.twitter import perform_twitter_task
from app.utils.sol import verify_solana_memo_tx, is_user_wallet_qualified
from app.typing.requests import MessageJson
from app.typing.tasks import TaskResponse


@api.route('/tasks', methods=['POST'])
def submit_task():
    # verify user wallet satisfies qualification criteria
    user_wallet: str = request.json['wallet']
    (
        qualified,
        user_balance,
        required_balance
    ) = is_user_wallet_qualified(user_wallet)
    if not qualified:
        return jsonify({
            'success': False,
            'errors': [
                (
                    f'This wallet only has {user_balance} tokens'
                    f' ({required_balance} required)'
                )
            ]
        }), 403

    # verify message content matches messageHash
    message: MessageJson = request.json['message']
    message_text: str = json.dumps(message, separators=(',', ':'))
    message_hash: str = request.json['messageHash']
    computed_message_hash = hashlib.sha256(
        message_text.encode('utf-8')
    ).hexdigest()
    if message_hash != computed_message_hash:
        return jsonify({
            'success': False,
            'errors': [f'Submitted hash does not match message']
        }), 400

    # verify tx succeeded, wallet signed tx,
    #     tx is memo, and memo matches message hash
    tx_id: str = request.json['txId']
    tx_error = verify_solana_memo_tx(tx_id, user_wallet, message_hash)
    if tx_error:
        return jsonify({
            'success': False,
            'errors': [tx_error]
        }), 400

    # TODO: save task reference in database

    if message['module'] == 'twitter':
        task_response: TaskResponse = perform_twitter_task(message)
        return jsonify({
            'success': task_response.success,
            'errors': task_response.errors,
            'data': task_response.data
        }), 200 if task_response.success else 422
    else:
        return jsonify({
            'success': False,
            'errors': [f'Unsupported module: {message["module"]}']
        }), 422

    return jsonify({'success': True}), 200
