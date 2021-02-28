using System;

namespace Fit2Fitter.Dto
{
    public class ClientDto
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
