using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace SpaceApp.Helpers.AppSettings
{
    public class AppSettingsHelper
    {
        //Endpoints
        public static string NasaAsteroidsEndpoint = ConfigurationManager.AppSettings["NasaAsteroids:Endpoint"];
    }
}