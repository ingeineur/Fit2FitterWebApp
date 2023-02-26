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

        Task <int> AddClient(ClientDto client);

        Task<bool> AddLogin(LoginDto login);

        Task<bool> AddMeasurement(MeasurementDto measurement, bool update);

        Task<bool> AddDaily(DailyDto daily);

        Task<bool> AddMacrosPlan(MacrosPlanDto plan);

        Task<IEnumerable<MeasurementDto>> GetMeasurement(int clientId, DateTime date);

        Task<IEnumerable<MeasurementDto>> GetMeasurements(int clientId, DateTime fromDate, DateTime date);
        
        Task<IEnumerable<MeasurementDto>> GetMeasurementsSlice(int clientId, DateTime fromDate, DateTime toDate);

        Task<IEnumerable<MeasurementDto>> GetMeasurementsClosest(int clientId, DateTime date);

        Task<IEnumerable<DailyDto>> GetDaily(int clientId, DateTime date);

        Task<IEnumerable<LoginDto>> GetLogin(string username, string password);

        Task<IEnumerable<LoginDto>> GetLogin(int clientId);
        
        Task<bool> ResetLogin(string username);

        Task<IEnumerable<MacrosPlanDto>> GetMacrosPlan(int clientId);

        Task<bool> DeleteClient(int clientId);
    }
}
