using Microsoft.AspNetCore.SignalR;

namespace SignalRExample.Hubs
{
    public class HouseGroupHub : Hub
    {

        public static List<string> GroupsJoined { get; set; } = new List<string>();

        public async Task JoinHouse(string houseName)
        {
            if (!GroupsJoined.Contains(Context.ConnectionId+":"+houseName))
            {
                GroupsJoined.Add(Context.ConnectionId+":"+houseName);

                string houseList = "";
                GroupsJoined.ForEach(s =>
                {
                    if (s.Contains(Context.ConnectionId))
                    {
                        houseList += s.Split(":")[1] + " ";
                    }
                });

                await Clients.Caller.SendAsync("subscriptionStatus", houseList, houseName, true);

                await Groups.AddToGroupAsync(Context.ConnectionId, houseName);

                await Clients.OthersInGroup(houseName).SendAsync("notifyOthersOnSubscription", Context.ConnectionId, houseName, true);
            }
        }

        public async Task LeaveHouse(string houseName)
        {
            if (GroupsJoined.Contains(Context.ConnectionId + ":" + houseName))
            {
                GroupsJoined.Remove(Context.ConnectionId + ":" + houseName);

                string houseList = "";
                GroupsJoined.ForEach(s =>
                {
                    if (s.Contains(Context.ConnectionId))
                    {
                        houseList += s.Split(":")[1] + " ";
                    }
                });

                await Clients.Caller.SendAsync("subscriptionStatus", houseList, houseName, false);

                await Clients.OthersInGroup(houseName).SendAsync("notifyOthersOnSubscription", Context.ConnectionId, houseName, false);

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);

            }
        }

        public async Task TriggerNotification(string houseName)
        {
            await Clients.OthersInGroup(houseName).SendAsync("notifyTriggerRecipients", Context.ConnectionId, houseName);

            await Clients.Caller.SendAsync("notifyTriggerSender", houseName);
        }

    }
}
