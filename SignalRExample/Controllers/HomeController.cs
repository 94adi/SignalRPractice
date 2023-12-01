using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRExample.Hubs;
using SignalRExample.Models;
using System.Diagnostics;

namespace SignalRExample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHubContext<DeathlyHallowsHub> _deathlyHallowsHub;

        public HomeController(ILogger<HomeController> logger,
            IHubContext<DeathlyHallowsHub> deathlyHallowsHub)
        {
            _logger = logger;
            _deathlyHallowsHub = deathlyHallowsHub;
        }

        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> DeathlyHallows(string type)
        {
            if (StaticDetails.DealthyHallowRace.ContainsKey(type))
            {
                StaticDetails.DealthyHallowRace[type]++;
            }

            await _deathlyHallowsHub.Clients.All.SendAsync("updateDeathlyHallowCount",
                StaticDetails.DealthyHallowRace[StaticDetails.Cloak],
                StaticDetails.DealthyHallowRace[StaticDetails.Stone],
                StaticDetails.DealthyHallowRace[StaticDetails.Wand]);

            return Accepted();
        }

        public IActionResult Notification()
        {
            return View();
        }


    }
}