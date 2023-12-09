var connectionChat = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .build();

document.getElementById("sendMessage").disabled = true;

connectionChat.on("MessageReceived", function (u, m) {
    let li = document.createElement("li");
    li.textContent = `${u} - ${m}`;
    document.getElementById("messagesList").appendChild(li);
});

connectionChat.on("PrivateMessageReceived", function (s, m) {

    let li = document.createElement("li");
    li.textContent = `Sender: ${s} - Message ${m}`;
    document.getElementById("messagesList").appendChild(li);
});

connectionChat.on("PrivateMessageNotSent", function (r, m) {
    let li = document.createElement("li");
    li.textContent = `Private message to: ${r} could not be sent - Message ${m}`;
    document.getElementById("messageList").appendChild(li);
});

document.getElementById("sendMessage").addEventListener("click", function (e) {

    let sender = document.getElementById("senderEmail").value;
    let message = document.getElementById("chatMessage").value;
    let receiver = document.getElementById("receiverEmail").value;

    if (receiver.length > 0)
    {
        connectionChat.send("SendPrivateMessage",sender,receiver,message);
    }
    else
    {
        //send message to all of the users
        connectionChat.send("SendMessageToAll", sender, message);
    }

    e.preventDefault();
});


connectionChat.start().then(function () {

    console.log("Connected successfully");
    document.getElementById("sendMessage").disabled = false;

}, function () {
    console.log("Connection failed");
});