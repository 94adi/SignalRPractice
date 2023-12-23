var connectionChat = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connectionChat.on("ReceiveUserConnected", function (userId, userName, isOldConnection) {
    if (!isOldConnection)
    {
        addMessage(`${userName} has a connection open`);
    }
});

connectionChat.on("RecieveUserDisconnected", function (userId, userName) {
        addMessage(`${userName} has closed a connection`);
});

connectionChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

connectionChat.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userName) {
    addMessage(`${userName} has deleted room ${roomName}`);
    fillRoomDropDown();
});

connectionChat.on("ReceivePublicMessage", function (roomId, userId, userName, message, roomName) {

    addMessage(`[Public message - ${rootName}] ${userName} says ${message}`);

});

connectionChat.on("ReceivePrivateMessage", function (senderId, senderName, receiverId, message, chatId, receiverName) {

    addMessage(`[Private message - ${receiverName}] ${senderName} says ${message}`);

});

function sendPrivateMessage() {

    let inputMsg = document.getElementById('txtPrivateMessage');
    let ddlSelUser = document.getElementById('ddlSelUser');

    let receiverId = ddlSelUser.value;
    let receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;

    let message = inputMsg.value;

    connectionChat.send("SendPrivateMessage", receiverId, message, receiverName);

}

function sendPublicMessage() {

    let inputMsg = document.getElementById('txtPublicMessage');
    let ddlSelRoom = document.getElementById('ddlSelRoom');

    let roomId = ddlSelRoom.value;
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;

    let message = inputMsg.value;

    connectionChat.send("SendPublicMessage", Number(roomId), message, roomName);
}

function addNewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }

    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.invoke("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = '';


        },
        error: function (xhr) {
            alert('error');
        }
    })
}

function deleteChatRoom() {
    let ddlDelRoom = document.getElementById("ddlDelRoom");
    const chatRoomId = ddlDelRoom.value;
    const roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;
    if (chatRoomId == null || chatRoomId == '') return;

    $.ajax({
        url: '/ChatRooms/DeleteChatRoom/' + chatRoomId,
        dataType: 'json',
        type: 'DELETE',
        contentType: 'application/json',
        async: true,
        success: function (json) {
        alert(`Chatroom with id: ${chatRoomId} was deleted successfully!`);
            connectionChat.invoke("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();
        },
        error: () => {
            alert(`Chatroom with id: ${chatRoomId} could not be deleted!`);
        }

    })
}


document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})


function fillUserDropDown() {

    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);


            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRooms')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}


function addMessage(msg) {
    if (msg == null || msg == '') {
        return;
    }

    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
}

connectionChat.start().then(
    function ()
    {
        console.log("Connected successfully");
    },
    function ()
    {
    console.log("Connection failed");
    });