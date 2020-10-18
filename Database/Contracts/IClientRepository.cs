using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;

namespace Fit2Fitter.Database.Contracts
{
    public interface IClientRepository
    {
        /// <summary>
        /// Finds the user.
        /// </summary>
        /// <param name="id">The user id.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Client>> FindClientById(int id);

        /// <summary>
        /// Finds the client login.
        /// </summary>
        /// <param name="id">The client id.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Login>> FindLoginByClientId(int clientId);

        /// <summary>
        /// Finds the user.
        /// </summary>
        /// <param name="name">The user name.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Client>> FindClientByName(string name);

        /// <summary>
        /// Get all clients
        /// </summary>
        /// <returns></returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Client>> FindAllClients();

        /// <summary>
        /// Finds the macros plan.
        /// </summary>
        /// <param name="id">The client id.</param>
        /// <returns>The macros plan for the client.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.MacrosPlan>> FindMacrosPlan(int clientId);

        /// <summary>
        /// Finds the login details.
        /// </summary>
        /// <param name="name">The user name.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Login>> GetLogin(string username, string password);

        /// <summary>
        /// Finds the login details.
        /// </summary>
        /// <param name="clientId">The user clientId.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Login>> GetLogin(int clientId);

        /// <summary>
        /// Add a new client.
        /// </summary>
        /// <param name="client"></param>
        /// <returns></returns>
        Task AddClient(Client client);

        /// <summary>
        /// Add a new login for a client.
        /// </summary>
        /// <param name="login"></param>
        /// <returns></returns>
        Task AddLogin(Login login);

        /// <summary>
        /// Delete a client.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        Task DeleteClient(int clientId);

        /// <summary>
        /// Delete client's login.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        Task DeleteLogin(int clientId);

        /// <summary>
        /// Add a new macros plan for a client.
        /// </summary>
        /// <param name="macrosPlan"></param>
        /// <returns></returns>
        Task AddMacroPlan(MacrosPlan macrosPlan);
    }
}
