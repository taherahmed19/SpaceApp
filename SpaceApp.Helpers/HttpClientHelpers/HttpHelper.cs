using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Threading.Tasks;

namespace SpaceApp.Helpers.HttpClientHelpers
{
    public static class HttpHelper
    {
        private static HttpClient client = new HttpClient();

        public static async Task<HttpResponseMessage> MakeApiRequest(string requestPath)
        {
            try
            {
                return await client.GetAsync(requestPath);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public static string ContentToString(this HttpContent httpContent)
        {
            var readAsStringAsync = httpContent.ReadAsStringAsync();
            return readAsStringAsync.Result;
        }
    }
}