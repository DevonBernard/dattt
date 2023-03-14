import hashlib
import json
from flask import request, jsonify
from app.api import api
from app.utils.twitter import perform_twitter_task
from app.typing.requests import MessageJson
from app.typing.tasks import TaskResponse


@api.route('/tasks', methods=['POST'])
def submit_task():
    message: MessageJson = request.json['message']
    message_text: str = json.dumps(message, separators=(',', ':'))
    # TODO: verify walletAddress satisfies community eligibility criteria

    # verify message content matches messageHash
    message_hash: str = request.json['messageHash']
    computed_message_hash = hashlib.sha256(
        message_text.encode('utf-8')
    ).hexdigest()
    if message_hash != computed_message_hash:
        return jsonify({
            'success': False,
            'errors': [f'Submitted hash does not match message']
        }), 400

    # TODO: verify tx succeeded
    # TODO: verify tx memo matches messageHash
    # TODO: verify walletAddress is tx signer
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
