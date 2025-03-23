const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");
//get username and room from the qs library

const {username,room } = Qs.parse(location.search,{ignoreQueryPrefix:true})



const socket = io();

//join chatroom
socket.emit("joinedRoom",{username,room})

//get room and users
socket.on("roomUsers",({room,users})=>{
    outputRoom(room);
    outputUsers(users);
})

socket.on("message",message =>{
    console.log(message);
    output(message);

    //scroll chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight

})



chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value
    socket.emit("chatMessage",msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

const output = (message)=>{
    const div = document.createElement('div');
    div.classList.add("message")
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    document.querySelector(".chat-messages").appendChild(div);

}

//add room name to dom
function outputRoom(room){
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users){
    usersList.innerHTML = `${users.map((user)=> `<li>${user.username}</li>`).join("")}`
}