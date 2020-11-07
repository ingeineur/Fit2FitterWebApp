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
    public class ClientController : Controller
    {
        private readonly IClientService clientService;

        public ClientController(IClientService clientService)
        {
            this.clientService = clientService;
        }

        // GET api/<controller>/5
        [HttpGet("{keyword}")]
        public async Task<IEnumerable<ClientDto>> Get(string keyword)
        {
            var clients = await this.clientService.FindClient(keyword).ConfigureAwait(false);
            return clients.ToArray();
        }

        [HttpGet]
        public async Task<IEnumerable<ClientDto>> Get(int clientId)
        {
            var clients = await this.clientService.FindClient(clientId).ConfigureAwait(false);
            return clients.ToArray();
        }

        [HttpGet("all")]
        public async Task<IEnumerable<ClientDto>> Get()
        {
            var clients = await this.clientService.FindAllClients().ConfigureAwait(false);
            return clients.ToArray();
        }

        // PUT api/<controller>/5
        [HttpPut]
        public async Task<IActionResult> Put([FromBody, Required]ClientDto client)
        {
            var result = await this.clientService.AddClient(client).ConfigureAwait(false);
            return this.Ok(result);
        }

        // DELETE api/<controller>/5
        [HttpDelete("{clientId}")]
        public async Task<IActionResult> Delete(int clientId)
        {
            var result = await this.clientService.DeleteClient(clientId).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("measurement")]
        public async Task<IActionResult> Put([FromBody, Required]MeasurementDto measurement, [FromQuery, Required] string date)
        {
            measurement.Created = DateTime.Parse(date);
            var result = await this.clientService.AddMeasurement(measurement, false).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("measurement/update")]
        public async Task<IActionResult> Update([FromBody, Required]MeasurementDto measurement, [FromQuery, Required] string date)
        {
            measurement.Created = DateTime.Parse(date);
            var result = await this.clientService.AddMeasurement(measurement, true).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("daily")]
        public async Task<IActionResult> Put([FromBody, Required]DailyDto daily)
        {
            var result = await this.clientService.AddDaily(daily).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("macrosplan")]
        public async Task<IActionResult> Put([FromBody, Required]MacrosPlanDto macrosPlan)
        {
            var result = await this.clientService.AddMacrosPlan(macrosPlan).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpGet("{clientId}/daily")]
        public async Task<IEnumerable<DailyDto>> GetDaily(int clientId, [FromQuery, Required] DateTime date)
        {
            var data = await this.clientService.GetDaily(clientId, date).ConfigureAwait(false);
            return data.ToArray();
        }

        // GET api/<controller>/5
        [HttpGet("{clientId}/measurements")]
        public async Task<IEnumerable<MeasurementDto>> GetMeasurement(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.clientService.GetMeasurement(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/all/measurements")]
        public async Task<IEnumerable<MeasurementDto>> GetMeasurements(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.clientService.GetMeasurements(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/measurements/closest")]
        public async Task<IEnumerable<MeasurementDto>> GetMeasurementClosest(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.clientService.GetMeasurementsClosest(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/macrosplan")]
        public async Task<IEnumerable<MacrosPlanDto>> GetMacrosPlan(int clientId)
        {
            var data = await this.clientService.GetMacrosPlan(clientId).ConfigureAwait(false);
            return data.ToArray();
        }
    }
}
