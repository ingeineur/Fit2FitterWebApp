using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Contracts;
using Fit2Fitter.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Fit2Fitter.Database.Data
{
    public class ClientRepository:IClientRepository
    {
        private readonly DatabaseContext databaseContext;
        
        /// <summary>
        /// The base query.
        /// </summary>
        private readonly IQueryable<Client> baseQuery;

        public ClientRepository(DatabaseContext databaseContext)
        {
            this.databaseContext = databaseContext;
            this.baseQuery = this.databaseContext.Clients;
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Client>> FindClientById(int id)
        {
            return await this.baseQuery.Where(x =>
                x.Id == id).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Login>> FindLoginByClientId(int ClientId)
        {
            return await this.databaseContext.Logins.Where(x =>
                x.ClientId == ClientId).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Client>> FindClientByName(string name)
        {
            return await this.baseQuery.Where(x =>
                x.FirstName.Contains(name)).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Client>> FindAllClients()
        {
            return await this.baseQuery.ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.MacrosPlan>> FindMacrosPlan(int clientId)
        { 
            return await this.databaseContext.MacrosPlans.Where(x =>
                 x.ClientId == clientId).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Models.Login>> GetLogin(string username, string password)
        {
            return await this.databaseContext.Logins.Where(x =>
                x.Username == username && x.Password == password).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task AddClient(Client client)
        {
            var result = await this.databaseContext.Clients.SingleOrDefaultAsync(x =>
                x.Id == client.Id).ConfigureAwait(false);

            if (result != null)
            {
                result.FirstName = client.FirstName;
                result.LastName = client.LastName;
                result.Age = client.Age;
                result.Address = client.Address;
                result.City = client.City;
            }
            else
            {
                await this.databaseContext.Clients.AddAsync(client).ConfigureAwait(false);
            }

            await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
        }

        public async Task AddLogin(Login login)
        {
            var client = await this.FindClientById(login.ClientId).ConfigureAwait(false);
            if (client != null)
            {
                var result = await this.databaseContext.Logins.Where(x => x.ClientId == login.ClientId).SingleOrDefaultAsync().ConfigureAwait(false);
                if (result != null)
                {
                    result.Password = login.Password;
                }
                else
                {
                    await this.databaseContext.Logins.AddAsync(login).ConfigureAwait(false);
                }

                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task DeleteClient(int clientId)
        {
            var client = await this.FindClientById(clientId).ConfigureAwait(false);
            if (client != null && client.First() != null)
            {
                // Delete client login
                await this.DeleteLogin(clientId).ConfigureAwait(false);

                // Delete client
                this.databaseContext.Clients.Remove(client.First());
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task DeleteLogin(int clientId)
        {
            var login = await this.FindLoginByClientId(clientId).ConfigureAwait(false);
            if (login != null && login.First() != null)
            {
                this.databaseContext.Logins.Remove(login.First());
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task AddMacroPlan(MacrosPlan plan)
        {
            var client = await this.FindClientById(plan.ClientId).ConfigureAwait(false);
            if (client != null)
            {
                var result = await this.databaseContext.MacrosPlans.SingleOrDefaultAsync(x =>
                x.ClientId == plan.ClientId).ConfigureAwait(false);

                if (result != null)
                {
                    result.ActivityLevel = plan.ActivityLevel;
                    result.MacroType = plan.MacroType;
                    result.CarbPercent = plan.CarbPercent;
                    result.ProteinPercent = plan.ProteinPercent;
                    result.FatPercent = plan.FatPercent;
                    result.Weight = plan.Weight;
                    result.Height = plan.Height;
                    result.TargetWeight = plan.TargetWeight;
                }
                else
                {
                    await this.databaseContext.MacrosPlans.AddAsync(plan).ConfigureAwait(false);
                }

                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }
    }
}
