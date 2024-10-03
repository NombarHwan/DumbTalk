from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from datetime import datetime
import os

app = Flask(__name__)
socketio = SocketIO(app)

# 유저 이름 파악하기 위한 dict,
connected_users = {}

# 로그 파일들 관리
log_file_path = f"log/chat_logs_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt"
os.makedirs(os.path.dirname(log_file_path), exist_ok=True)

# 시작할 때 로그 파일을 생성한다.
with open(log_file_path, "w") as file:
    file.write(f"This file was created at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

@app.route('/')
def index():
    return render_template("index.html")

def log_message(message):
    """Helper function to log messages."""
    with open(log_file_path, "a") as file:  # Append 모드(파일 꼬리에 추가)
        file.write(message + "\n")

@socketio.on('message')
def handle_message(msg):
    print(f"Received message: {msg}")
    log_message(msg)
    emit('message', msg, broadcast=True)

@socketio.on('connect')
def handle_connect():
    print("A user connected.")

@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    if sid in connected_users:
        username = connected_users[sid]
        disconnect_msg = f"{username} has disconnected!"
        emit('message', disconnect_msg, broadcast=True)
        log_message(disconnect_msg)
        del connected_users[sid]

@socketio.on('register') 
def register_username(username):
    sid = request.sid
    connected_users[sid] = username
    connect_msg = f"{username} has entered the chat!"
    emit('message', connect_msg, broadcast=True)
    log_message(connect_msg)

if __name__ == '__main__':
    socketio.run(app)
