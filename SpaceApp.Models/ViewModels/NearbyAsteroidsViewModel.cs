﻿using SpaceApp.Models.Models.Asteroid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceApp.Models.ViewModels
{
    public class NearbyAsteroidsViewModel
    {
        public List<Asteroid> Asteroids { get; set; }
    }
}