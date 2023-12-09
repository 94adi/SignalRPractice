using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRExample.Data;

namespace SignalRExample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task SendMessageToAll(string user, string message)
        {
            await Clients.All.SendAsync("MessageReceived", user, message);
        }

        [Authorize]
        public async Task SendPrivateMessage(string sender, string receiver, string message)
        {
            var receiverId = _db.Users.Where(u => u.Email.ToLower() == receiver.ToLower())
                                      .Select(u => u.Id)
                                      .FirstOrDefault();
            if(!string.IsNullOrEmpty(receiverId))
            {
                await Clients.User(receiverId).SendAsync("MessageReceived", sender, message);
            }
            else
            {
                await Clients.Caller.SendAsync("PrivateMessageNotSent", receiver, message);
            }


        }
    }
}
