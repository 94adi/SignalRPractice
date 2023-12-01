using Microsoft.AspNetCore.SignalR;

namespace SignalRExample.Hubs
{
    public class UserHub : Hub
    {

        public static int TotalViews { get; set; } = 0;

        public static int TotalUsers { get; set; } = 0;

        public async Task<string> NewWindowLoaded(string name)
        {
            TotalViews++;
            //send update to all clients with the updated totalViews value
            //updateTotalViews <- located on the client side; called from the server on the client (server -> client)
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
            return $"Total views from {name} : {TotalViews}";
        }


        public override Task OnConnectedAsync()
        {
            TotalUsers++;
            Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            TotalUsers--;
            Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            return base.OnDisconnectedAsync(exception);
        }

    }
}
