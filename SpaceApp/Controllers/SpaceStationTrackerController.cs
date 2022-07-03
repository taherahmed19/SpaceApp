using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpaceApp.Controllers
{
    public class SpaceStationTrackerController : Controller
    {
        // GET: SpaceStation
        public ActionResult Index()
        {
            return View();
        }
    }
}