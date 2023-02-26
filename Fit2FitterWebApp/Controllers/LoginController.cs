using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Fit2Fitter.Dto;
using Fit2Fitter.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Fit2FitterWebApp.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly IClientService clientService;

        public LoginController(IClientService clientService)
        {
            this.clientService = clientService;
        }

        // GET api/<controller>/5
        [HttpGet]
        public async Task<IEnumerable<LoginDto>> Get(string username, string password)
        {
            var logins = await this.clientService.GetLogin(username, password).ConfigureAwait(false);
            return logins.ToArray();
        }

        [HttpGet("{clientId}")]
        public async Task<IEnumerable<LoginDto>> Get(int clientId)
        {
            var logins = await this.clientService.GetLogin(clientId).ConfigureAwait(false);
            return logins.ToArray();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody, Required]LoginDto login)
        {   
            var result = await this.clientService.AddLogin(login).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPost("reset")]
        public async Task<IActionResult> Post([FromQuery, Required] string username)
        {
            var result = await this.clientService.ResetLogin(username).ConfigureAwait(false);
            return this.Ok(result);
        }
    }
}
