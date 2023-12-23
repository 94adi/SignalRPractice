using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRExample.Data;
using SignalRExample.Hubs;
using SignalRExample.Models;
using SignalRExample.Models.ViewModel;
using System.Diagnostics;
using System.Security.Claims;

namespace SignalRExample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHubContext<DeathlyHallowsHub> _deathlyHallowsHub;
        private readonly IHubContext<OrderHub> _orderHub;
        private readonly ApplicationDbContext _context;


        public HomeController(ILogger<HomeController> logger,
            IHubContext<DeathlyHallowsHub> deathlyHallowsHub,
            IHubContext<OrderHub> orderHub,
            ApplicationDbContext context)
        {
            _logger = logger;
            _deathlyHallowsHub = deathlyHallowsHub;
            _orderHub = orderHub; 
            _context = context;
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

        public IActionResult DeathlyHallowRace()
        {
            return View();
        }

        public IActionResult HarryPotterHouse()
        {
            return View();
        }

        public IActionResult BasicChat()
        {
            return View();
        }

        [ActionName("Order")]
        public async Task<IActionResult> Order()
        {
            string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
            string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

            Random rand = new Random();
            // Generate a random index less than the size of the array.  
            int index = rand.Next(name.Length);

            Order order = new Order()
            {
                Name = name[index],
                ItemName = itemName[index],
                Count = index
            };

            return View(order);
        }

        [ActionName("Order")]
        [HttpPost]
        public async Task<IActionResult> OrderPost(Order order)
        {

            _context.Orders.Add(order);
            _context.SaveChanges();

            await _orderHub.Clients.All.SendAsync("newOrder");
            return RedirectToAction(nameof(Order));
        }
        [ActionName("OrderList")]
        public async Task<IActionResult> OrderList()
        {
            return View();
        }
        [HttpGet]
        public IActionResult GetAllOrder()
        {
            var productList = _context.Orders.ToList();
            return Json(new { data = productList });
        }

        [Authorize]
        public IActionResult Chat()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ChatVM chatVM = new()
            {
                Rooms = _context.ChatRooms.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId,
            };

            return View(chatVM);
        }

        public IActionResult AdvancedChat()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ChatVM chatVM = new()
            {
                Rooms = _context.ChatRooms.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId,
            };

            return View(chatVM);
        }

    }
}