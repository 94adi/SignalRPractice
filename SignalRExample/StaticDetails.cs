namespace SignalRExample
{
    public static class StaticDetails
    {

        static StaticDetails()
        {
            DealthyHallowRace = new Dictionary<string, int>();
            NotificationHistory = new List<string>();
            notificationCounter = 0;
            DealthyHallowRace.Add(Cloak, 0);
            DealthyHallowRace.Add(Stone, 0);
            DealthyHallowRace.Add(Wand, 0);
        }


        public const string Wand = "wand";
        public const string Stone = "stone";
        public const string Cloak = "cloak";

        public static Dictionary<string, int> DealthyHallowRace;

        public static List<string> NotificationHistory;
        public static int notificationCounter;
        

    }
}
