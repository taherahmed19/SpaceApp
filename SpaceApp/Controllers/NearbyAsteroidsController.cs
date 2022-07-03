using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpaceApp.Controllers
{
    public class NearbyAsteroidsController : Controller
    {
        // GET: NearbyAsteroids
        public ActionResult Index()
        {
            return View();
        }
    }
}