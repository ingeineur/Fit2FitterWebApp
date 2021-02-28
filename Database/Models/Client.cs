using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fit2Fitter.Database.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public int Age { get; set; }
        public string Grp { get; set; }
        public DateTime Created { get; set; }
        public string Avatar { get; set; }
    }
}
