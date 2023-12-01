var connectionHouse = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/hubs/houseGroupHub")
    .build();

let lbl_houseJoined = document.getElementById("lbl_houseJoined");


let btn_un_gryffindor = document.getElementById("btn_un_gryffindor");
let btn_un_slytherin = document.getElementById("btn_un_slytherin");
let btn_un_hufflepuff = document.getElementById("btn_un_hufflepuff");
let btn_un_ravenclaw = document.getElementById("btn_un_ravenclaw");
let btn_gryffindor = document.getElementById("btn_gryffindor");
let btn_slytherin = document.getElementById("btn_slytherin");
let btn_hufflepuff = document.getElementById("btn_hufflepuff");
let btn_ravenclaw = document.getElementById("btn_ravenclaw");

let trigger_gryffindor = document.getElementById("trigger_gryffindor");
let trigger_slytherin = document.getElementById("trigger_slytherin");
let trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
let trigger_ravenclaw = document.getElementById("trigger_ravenclaw");

btn_gryffindor.addEventListener("click", function (e) {
    connectionHouse.send("JoinHouse", "Gryffindor")
    e.preventDefault();
});

btn_slytherin.addEventListener("click", function (e) {
    connectionHouse.send("JoinHouse", "Slytherin")
    e.preventDefault();
});

btn_hufflepuff.addEventListener("click", function (e) {
    connectionHouse.send("JoinHouse", "Hufflepuff")
    e.preventDefault();
});

btn_ravenclaw.addEventListener("click", function (e) {
    connectionHouse.send("JoinHouse", "Ravenclaw")
    e.preventDefault();
});

btn_un_gryffindor.addEventListener("click", function (e) {
    connectionHouse.send("LeaveHouse", "Gryffindor")
    e.preventDefault();
});

btn_un_slytherin.addEventListener("click", function (e) {
    connectionHouse.send("LeaveHouse", "Slytherin")
    e.preventDefault();
});

btn_un_hufflepuff.addEventListener("click", function (e) {
    connectionHouse.send("LeaveHouse", "Hufflepuff")
    e.preventDefault();
});

btn_un_ravenclaw.addEventListener("click", function (e) {
    connectionHouse.send("LeaveHouse", "Ravenclaw")
    e.preventDefault();
});

trigger_gryffindor.addEventListener("click", function (e) {
    connectionHouse.send("TriggerNotification", "Gryffindor"); 
    e.preventDefault();
});

trigger_slytherin.addEventListener("click", function (e) {
    connectionHouse.send("TriggerNotification", "Slytherin");
    e.preventDefault();
});

trigger_hufflepuff.addEventListener("click", function (e) {
    connectionHouse.send("TriggerNotification", "Hufflepuff");
    e.preventDefault();
});

trigger_ravenclaw.addEventListener("click", function (e) {
    connectionHouse.send("TriggerNotification", "Ravenclaw");
    e.preventDefault();
});

connectionHouse.on("subscriptionStatus", (strGroupsJoined, houseName, hasSubscribed) => {
    lbl_houseJoined.innerText = strGroupsJoined;
    houseName = houseName.toLowerCase();
    if (hasSubscribed) {
        switch (houseName) {
            case 'slytherin':
                btn_slytherin.style.display = "none";
                btn_un_slytherin.style.display = "";
                break;
            case 'hufflepuff':
                btn_hufflepuff.style.display = "none";
                btn_un_hufflepuff.style.display = "";
                break;
            case 'gryffindor':
                btn_gryffindor.style.display = "none";
                btn_un_gryffindor.style.display = "";
                break;
            case 'ravenclaw':
                btn_ravenclaw.style.display = "none";
                btn_un_ravenclaw.style.display = "";
                break;
            default: break;
        }

        toastr.success(`You have subscribed successfully. ${houseName}`);
    }
    else {

        switch (houseName) {
            case 'slytherin':
                btn_slytherin.style.display = "";
                btn_un_slytherin.style.display = "none";
                break;
            case 'hufflepuff':
                btn_hufflepuff.style.display = "";
                btn_un_hufflepuff.style.display = "none";
                break;
            case 'gryffindor':
                btn_gryffindor.style.display = "";
                btn_un_gryffindor.style.display = "none";
                break;
            case 'ravenclaw':
                btn_ravenclaw.style.display = "";
                btn_un_ravenclaw.style.display = "none";
                break;
            default: break;
        }

        toastr.success(`You have unsubscribed successfully. ${houseName}`);

    }
})

connectionHouse.on("notifyOthersOnSubscription", (userId, houseName, isSubscribing) => {
    if (isSubscribing)
        toastr.success(`${userId} has joined the ${houseName} group!`);
    else
        toastr.warning(`${userId} has left the ${houseName} group!`);
});

connectionHouse.on("notifyTriggerRecipients", (userId, houseName) => {
    toastr.info(`${userId} belonging to the ${houseName} group sent a notification`);
});

connectionHouse.on("notifyTriggerSender", (houseName) => {
    toastr.success(`You have successfully sent a notification to the ${houseName} group`);
});

function fulfilled() {
    console.log("Successfull connection");
}

function rejected() {
    console.log("Connection failed");
}

//start connection
connectionHouse.start().then(fulfilled, rejected);