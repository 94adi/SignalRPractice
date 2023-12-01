﻿using Microsoft.AspNetCore.SignalR;

namespace SignalRExample.Hubs
{
    public class NotificationHub : Hub
    {

        public List<string> GetNotificationsHistory() => StaticDetails.NotificationHistory;

        public int IncrementNotificationCounter() => ++StaticDetails.notificationCounter;

        public void ResetNotificationCounter() => StaticDetails.notificationCounter = 0;

        public async Task ReceiveMessageFromClient(string message)
        {
            var notifications = GetNotificationsHistory();
            notifications.Add(message);
            var currentNotificationsCount = IncrementNotificationCounter();
            await Clients.All.SendAsync("triggerNotification", currentNotificationsCount);
            await Clients.All.SendAsync("updateNotificationsSection", notifications.ToArray());
        }

        public void ResetNotificationCounterSignal()
        {
            ResetNotificationCounter();
        }

    }
}
