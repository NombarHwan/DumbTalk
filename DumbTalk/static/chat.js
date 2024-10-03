console.log("chat.js is loaded");

const socket = io(); // socket.io 실행
let user;

function login() {
    const usernameInput = document.getElementById('username'); //username 가져오기
    const username = usernameInput.value.trim();
    
    if (username) {
        user = username;
        document.getElementById('login').style.display = 'none'; //none -> 로그인창 종료
        document.getElementById('chat').style.display = 'block'; //block -> 채팅창 오픈
        
		//회원가입, 유저 이름을 서버에 보낸다.
        socket.emit('register', username);
        usernameInput.value = ''; //인풋 밸류 초기화
        document.getElementById('messages').style.display = 'block';
    } else {
        alert("Please enter a valid name.");
    }
}

const sound = document.getElementById("msg");

socket.on('message', function(msg) {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");

    // Check if the message is an enter or disconnect message
    if (msg.includes("has entered the chat!") || msg.includes("has disconnected!")) {
        messageElement.classList.add("purple-message");
    } else {
		sound.currentTime = 0;
		sound.play(); //메시지 사운드
	}

    messageElement.textContent = msg;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
});

function sendMessage() {
    const messageInput = document.getElementById('message'); //input id=message인걸 받음
    const message = messageInput.value;

    const msgFormat = user + ": " + message; //이름을 채팅 앞에 붙임.
    socket.emit('message', msgFormat);
    messageInput.value = ''; //보내고 나서 채팅창 클리어.
}

document.getElementById('message').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    } //엔터키를 누르고도 메시지가 전송되도록 변경.
});
