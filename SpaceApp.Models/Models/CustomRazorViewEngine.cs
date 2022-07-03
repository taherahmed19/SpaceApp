using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpaceApp.Models.Models
{
    public class CustomRazorViewEngine : RazorViewEngine
    {

        public CustomRazorViewEngine()
        {
            string[] viewLocationFormat = new string[4];
            viewLocationFormat[0] = "~/Views/Shared/{0}.cshtml";
            viewLocationFormat[1] = "~/Views/Partials/{1}/{0}.cshtml";
            viewLocationFormat[2] = "~/Views/{1}/{0}.cshtml";
            viewLocationFormat[3] = "~/Views/{0}.cshtml";
            this.ViewLocationFormats = viewLocationFormat;
        }

    }
}