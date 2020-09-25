using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fit2Fitter.Database.Models
{
    public class Login
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }
        public DateTime LastLogin { get; set; }
        public int ClientId { get; set; }
    }
}
