//create connection



var connectionDeathlyHallows = new signalR.HubConnectionBuilder()
                                     //.configureLogging(signalR.LogLevel.Information)
                                     .withUrl("/hubs/deathlyhollows")
                                     .build();

//connect to methods that the hub invokes (server -> client)

connectionDeathlyHallows.on("updateDeathlyHallowCount", (cloak, stone, wand) => {

    document.getElementById("cloakCounter").innerText = cloak;
    document.getElementById("stoneCounter").innerText = stone
    document.getElementById("wandCounter").innerText = wand;
});

function newWindowLoadedOnClient() {
    console.log("Calling: NewWindowLoadedHallows");
    connectionDeathlyHallows.send("NewWindowLoadedHallows");
}

function fulfilled() {
    console.log("Successfull connection");
    newWindowLoadedOnClient();
}

function rejected() {
    console.log("Connection failed");
}

//start connection
connectionDeathlyHallows.start().then(fulfilled, rejected);