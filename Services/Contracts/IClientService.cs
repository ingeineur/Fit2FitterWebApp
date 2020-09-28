using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;

namespace Fit2Fitter.Services.Contracts
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> FindClient(string keyword);
        Task<IEnumerable<ClientDto>> FindClient(int clientId);
        Task<IEnumerable<ClientDto>> FindAllClients();

        Task <bool> AddClient(ClientDto client);

        Task<bool> AddLogin(LoginDto login);

        Task<bool> AddMeasurement(MeasurementDto measurement, bool update);

        Task<bool> AddDaily(DailyDto daily);

        Task<bool> AddMacrosPlan(MacrosPlanDto plan);

        Task<IEnumerable<MeasurementDto>> GetMeasurements(int clientId, DateTime date);

        Task<IEnumerable<MeasurementDto>> GetMeasurements(int clientId);

        Task<IEnumerable<MeasurementDto>> GetMeasurementsClosest(int clientId, DateTime date);

        Task<IEnumerable<DailyDto>> GetDaily(int clientId, DateTime date);

        Task<IEnumerable<LoginDto>> GetLogin(string username, string password);

        Task<IEnumerable<MacrosPlanDto>> GetMacrosPlan(int clientId);

        Task<bool> DeleteClient(int clientId);
    }
}
