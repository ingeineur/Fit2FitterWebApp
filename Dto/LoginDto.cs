using System;

namespace Fit2Fitter.Dto
{
    public class LoginDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }
        public DateTime LastLogin { get; set; }
        public int ClientId { get; set; }
    }
}
