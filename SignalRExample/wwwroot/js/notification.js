var connectionNotifications = new signalR.HubConnectionBuilder()
                                        .withUrl("/hubs/notification")
                                        .build();

let sendMessageBtn = document.getElementById("sendButton");
let messageTxtBox = document.getElementById("notificationInput");
let notificationBell = document.getElementById("notificationCounter");
let bellClasses = ['badge', 'rounded-pill', 'badge-notification', 'bg-danger'];
let notificationBellDropdown = document.getElementById("navbarDropdown");
let notificaitonsUl = document.getElementById("messageList");

connectionNotifications.on("triggerNotification", (count) => {
    notificationBell.classList.add(...bellClasses);
    notificationBell.innerText = '' + count;
});

connectionNotifications.on("updateNotificationsSection", (params) => {
    params.reverse();
    notificaitonsUl.innerHTML = "";
    let order = params.length;
    params.forEach((item) => {
        console.log(item);
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(order + ". " + item));
        order--;
        notificaitonsUl.appendChild(li);
    });
});



sendMessageBtn.addEventListener("click", function (e) {
    let message = messageTxtBox.value;
    messageTxtBox.value = "";
    connectionNotifications.send("ReceiveMessageFromClient", message);
    e.preventDefault();
})

notificationBellDropdown.addEventListener("click", function (e) {

    notificationBell.classList.remove(...bellClasses);
    notificationBell.innerText = '';
    connectionNotifications.send("ResetNotificationCounterSignal");
    //expand notifications list
    e.preventDefault();
});

function fulfilled() {
    console.log("Successfull connection");
    //load bell counter
}

function rejected() {
    console.log("Connection failed");
}

//start connection
connectionNotifications.start().then(fulfilled, rejected);