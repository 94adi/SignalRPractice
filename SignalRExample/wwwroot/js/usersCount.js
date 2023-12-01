//create connection

var connectionUserCount = new signalR.HubConnectionBuilder()
                                     //.configureLogging(signalR.LogLevel.Information)
                                     .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets)
                                     .build();

//connect to methods that the hub invokes (server -> client)

connectionUserCount.on("updateTotalViews", (value) => {
    console.log("incremented value:" + value);

    document.getElementById("totalViewsCounter").innerText = value;
});

connectionUserCount.on("updateTotalUsers", (value) => {
    console.log("incremented value:" + value);

    document.getElementById("totalUsersCounter").innerText = value;
});

//invoke hub methods (client -> server)
function newWindowLoadedOnClient() {
    console.log("Calling: NewWindowLoaded");
    connectionUserCount.invoke("NewWindowLoaded", "Adi").then((value) => console.log("Return value: " + value));
}


function fulfilled() {
    console.log("Successfull connection");
    newWindowLoadedOnClient();
}

function rejected() {
    console.log("Connection failed");
}

//start connection
connectionUserCount.start().then(fulfilled, rejected);