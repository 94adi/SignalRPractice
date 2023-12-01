using Microsoft.AspNetCore.SignalR;

namespace SignalRExample.Hubs
{
    public class DeathlyHallowsHub : Hub
    {
        public Dictionary<string, int> GetRaceStatus()
        {
            return StaticDetails.DealthyHallowRace;
        }

        public async Task NewWindowLoadedHallows()
        {
            await Clients.All.SendAsync("updateDeathlyHallowCount",
                StaticDetails.DealthyHallowRace[StaticDetails.Cloak],
                StaticDetails.DealthyHallowRace[StaticDetails.Stone],
                StaticDetails.DealthyHallowRace[StaticDetails.Wand]);
        }
    }
}
