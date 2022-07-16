using log4net;
using SpaceApp.Helpers.AppSettings;
using SpaceApp.Helpers.HttpClientHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using SpaceApp.Models.Models.Asteroid;
using SpaceApp.Models.ViewModels;

namespace SpaceApp.Controllers
{
    public class NearbyAsteroidsController : Controller
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(NearbyAsteroidsController));

        public async Task<ActionResult> Index()
        {
            string nasaAsteroidsEndpoint = AppSettingsHelper.NasaAsteroidsEndpoint;
            HttpResponseMessage response = await HttpHelper.MakeApiRequest(nasaAsteroidsEndpoint);

            var nearByAsteroidsViewModel = new NearbyAsteroidsViewModel();

            if (response.IsSuccessStatusCode)
            {
                var asteroids = JsonConvert.DeserializeObject<List<Asteroid>>(response.Content.ContentToString());
                nearByAsteroidsViewModel.Asteroids = asteroids;
            }

            return View(nearByAsteroidsViewModel);
        }

        public ActionResult Asteroid(int id)
        {
            AsteroidViewModel asteroidViewModel = new AsteroidViewModel { AsteroidId = id };

            return View(asteroidViewModel);
        }
    }
}