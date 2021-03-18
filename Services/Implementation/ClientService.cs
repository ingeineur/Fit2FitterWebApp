using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Contracts;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;
using Fit2Fitter.Services.Contracts;
using MailKit.Net.Smtp;
using MimeKit;

namespace Fit2Fitter.Services.Implementation
{
    public class ClientService:IClientService
    {
        private readonly IClientRepository clientRepository;
        private readonly ITrackerRepository trackerRepository;

        public ClientService(IClientRepository clientRepository, ITrackerRepository trackerRepository)
        {
            this.clientRepository = clientRepository;
            this.trackerRepository = trackerRepository;
        }

        public async Task<IEnumerable<ClientDto>> FindClient(string keyword)
        {
            var clients = await this.clientRepository.FindClientByName(keyword).ConfigureAwait(false);
            return clients.Select(client => new ClientDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                Address = client.Address,
                City = client.City,
                Age = client.Age,
                Grp = client.Grp,
                Created = client.Created,
                Avatar = client.Avatar
            });
        }

        public async Task<IEnumerable<ClientDto>> FindClient(int clientId)
        {
            var clients = await this.clientRepository.FindClientById(clientId).ConfigureAwait(false);
            return clients.Select(client => new ClientDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                Address = client.Address,
                City = client.City,
                Age = client.Age,
                Grp = client.Grp,
                Created = client.Created,
                Avatar = client.Avatar
            });
        }

        public async Task<IEnumerable<ClientDto>> FindAllClients()
        {
            var clients = await this.clientRepository.FindAllClients().ConfigureAwait(false);
            return clients.Select(client => new ClientDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                Address = client.Address,
                City = client.City,
                Age = client.Age,
                Grp = client.Grp,
                Created = client.Created,
                Avatar = client.Avatar
            });
        }

        public async Task<bool> AddClient(ClientDto client)
        {
            try
            {
                await this.clientRepository.AddClient(new Client
                {
                    Id = client.Id,
                    FirstName = client.FirstName,
                    LastName = client.LastName,
                    Address = client.Address,
                    City = client.City,
                    Age = client.Age,
                    Grp = client.Grp,
                    Avatar = client.Avatar,
                    Created = DateTime.Now
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddLogin(LoginDto login)
        {
            try
            {
                await this.clientRepository.AddLogin(new Login
                {
                    Username = login.Username,
                    Password = login.Password,
                    Active = true,
                    LastLogin = DateTime.Now,
                    ClientId = login.ClientId
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public string CreatePassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }

        public async Task<bool> ResetLogin(string username)
        {
            try
            {
                var password = CreatePassword(6);
                await this.clientRepository.ResetLogin(username, password).ConfigureAwait(false);

                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress("postmaster@idafit2fitter.com"));
                mimeMessage.To.Add(new MailboxAddress(username));
                mimeMessage.Subject = "Fit2Fitter Web App Password Reset";
                mimeMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text)
                { Text = "Your temporary password is: " + password };

                using (SmtpClient smtpClient = new SmtpClient())
                {
                    await smtpClient.ConnectAsync("mail.idafit2fitter.com",
                    8889, false);
                    await smtpClient.AuthenticateAsync("postmaster@idafit2fitter.com",
                    "B3@tl3s15011981");
                    await smtpClient.SendAsync(mimeMessage);
                    await smtpClient.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteClient(int clientId)
        {
            try
            {
                await this.clientRepository.DeleteClient(clientId).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddMeasurement(MeasurementDto measurement, bool update)
        {
            try
            {
                if (update)
                {
                    await this.trackerRepository.UpdateMeasurement(new Measurement
                    {
                        Id = measurement.Id,
                        Neck = measurement.Neck,
                        UpperArm = measurement.UpperArm,
                        Waist = measurement.Waist,
                        Hips = measurement.Hips,
                        Thigh = measurement.Thigh,
                        Chest = measurement.Chest,
                        Weight = measurement.Weight,
                        BodyFat = measurement.BodyFat,
                        Updated = DateTime.Now,
                        Created = measurement.Created,
                        ClientId = measurement.ClientId
                    }).ConfigureAwait(false);

                    return true;
                }
                await this.trackerRepository.AddMeasurement(new Measurement
                {
                    Neck = measurement.Neck,
                    UpperArm = measurement.UpperArm,
                    Waist = measurement.Waist,
                    Hips = measurement.Hips,
                    Thigh = measurement.Thigh,
                    Chest = measurement.Chest,
                    Weight = measurement.Weight,
                    BodyFat = measurement.BodyFat,
                    Updated = DateTime.Now,
                    Created = measurement.Created,
                    ClientId = measurement.ClientId
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddDaily(DailyDto daily)
        {
            try
            {
                await this.trackerRepository.AddDaily(new Daily
                {
                    Breakfast = daily.Breakfast,
                    Lunch = daily.Lunch,
                    Dinner = daily.Dinner,
                    Snack = daily.Snack,
                    TCB = daily.TCB,
                    TDS = daily.TDS,
                    TW = daily.TW,
                    Macros = daily.Macros,
                    Updated = DateTime.Now,
                    Created = DateTime.Now,
                    ClientId = daily.ClientId
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddMacrosPlan(MacrosPlanDto plan)
        {
            try
            {
                await this.clientRepository.AddMacroPlan(new MacrosPlan
                {
                    Height = plan.Height,
                    Weight = plan.Weight,
                    TargetWeight = plan.TargetWeight,
                    MacroType = plan.MacroType,
                    ActivityLevel = plan.ActivityLevel,
                    CarbPercent = plan.CarbPercent,
                    ProteinPercent = plan.ProteinPercent,
                    FatPercent = plan.FatPercent,
                    Updated = DateTime.Now,
                    Created = plan.Created,
                    ClientId = plan.ClientId
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<IEnumerable<MeasurementDto>> GetMeasurement(int clientId, DateTime date)
        {
            var measurements = await this.trackerRepository.FindMeasurement(clientId, date).ConfigureAwait(false);
            return measurements.Select(measurement => new MeasurementDto
            {
                Id = measurement.Id,
                Neck = measurement.Neck,
                UpperArm = measurement.UpperArm,
                Waist = measurement.Waist,
                Hips = measurement.Hips,
                Thigh = measurement.Thigh,
                Chest = measurement.Chest,
                Weight = measurement.Weight,
                BodyFat = measurement.BodyFat,
                Updated = measurement.Updated,
                Created = measurement.Created,
                ClientId = measurement.ClientId
            });
        }

        public async Task<IEnumerable<MeasurementDto>> GetMeasurements(int clientId, DateTime fromDate, DateTime date)
        {
            var measurements = await this.trackerRepository.FindMeasurements(clientId, fromDate, date).ConfigureAwait(false);
            return measurements.Select(measurement => new MeasurementDto
            {
                Id = measurement.Id,
                Neck = measurement.Neck,
                UpperArm = measurement.UpperArm,
                Waist = measurement.Waist,
                Hips = measurement.Hips,
                Thigh = measurement.Thigh,
                Chest = measurement.Chest,
                Weight = measurement.Weight,
                BodyFat = measurement.BodyFat,
                Updated = measurement.Updated,
                Created = measurement.Created,
                ClientId = measurement.ClientId
            });
        }

        public async Task<IEnumerable<MeasurementDto>> GetMeasurementsSlice(int clientId, DateTime fromDate, DateTime toDate)
        {
            var measurements = await this.trackerRepository.FindMeasurements(clientId, fromDate, toDate).ConfigureAwait(false);
            
            List<MeasurementDto> results = new List<MeasurementDto>();
            var days = (toDate - fromDate).Days;
            DateTime date = DateTime.Parse(fromDate.ToString());
            while (date <= toDate)
            {
                var measures = measurements.Where(x => Math.Abs((x.Created - date).TotalHours) <= 12);
                if (measures.Any())
                {
                    results.Add(new MeasurementDto
                    {
                        Id = 0,
                        Neck = measures.First().Neck,
                        UpperArm = measures.First().UpperArm,
                        Waist = measures.First().Waist,
                        Hips = measures.First().Hips,
                        Thigh = measures.First().Thigh,
                        Chest = measures.First().Chest,
                        Weight = measures.First().Weight,
                        BodyFat = measures.First().BodyFat,
                        Updated = measures.First().Updated,
                        Created = measures.First().Created,
                        ClientId = clientId
                    });
                }
                else if (results.Any())
                {
                    results.Add(new MeasurementDto
                    {
                        Id = 0,
                        Neck = results.Last().Neck,
                        UpperArm = results.Last().UpperArm,
                        Waist = results.Last().Waist,
                        Hips = results.Last().Hips,
                        Thigh = results.Last().Thigh,
                        Chest = results.Last().Chest,
                        Weight = results.Last().Weight,
                        BodyFat = results.Last().BodyFat,
                        Updated = results.Last().Updated,
                        Created = date,
                        ClientId = clientId
                    });
                }
                else
                {
                    var temp = await this.trackerRepository.FindMeasurementClosest(clientId, date).ConfigureAwait(false);
                    if (temp != null)
                    {
                        results.Add(new MeasurementDto
                        {
                            Id = 0,
                            Neck = temp.Neck,
                            UpperArm = temp.UpperArm,
                            Waist = temp.Waist,
                            Hips = temp.Hips,
                            Thigh = temp.Thigh,
                            Chest = temp.Chest,
                            Weight = temp.Weight,
                            BodyFat = temp.BodyFat,
                            Updated = temp.Updated,
                            Created = date,
                            ClientId = clientId
                        });
                    }
                    else
                    {
                        results.Add(new MeasurementDto
                        {
                            Id = 0,
                            Neck = 0,
                            UpperArm = 0,
                            Waist = 0,
                            Hips = 0,
                            Thigh = 0,
                            Chest = 0,
                            Weight = 0,
                            BodyFat = 0,
                            Updated = DateTime.Now,
                            Created = date,
                            ClientId = clientId
                        });
                    }
                }

                date = date.AddDays(1.0);
            }

            return results;
        }

        public async Task<IEnumerable<MeasurementDto>> GetMeasurementsClosest(int clientId, DateTime date)
        {
            var measurement = await this.trackerRepository.FindMeasurementClosest(clientId, date).ConfigureAwait(false);
            if (measurement != null)
            {
                return new[] {
                new MeasurementDto
                {
                    Id = measurement.Id,
                    Neck = measurement.Neck,
                    UpperArm = measurement.UpperArm,
                    Waist = measurement.Waist,
                    Hips = measurement.Hips,
                    Thigh = measurement.Thigh,
                    Chest = measurement.Chest,
                    Weight = measurement.Weight,
                    BodyFat = measurement.BodyFat,
                    Updated = measurement.Updated,
                    Created = measurement.Created,
                    ClientId = measurement.ClientId
                }};
            }
            return new List<MeasurementDto>();
        }

        public async Task<IEnumerable<DailyDto>> GetDaily(int clientId, DateTime date)
        {
            var dailies = await this.trackerRepository.FindDaily(clientId, date).ConfigureAwait(false);
            return dailies.Select(daily => new DailyDto
            {
                Id = daily.Id,
                Breakfast = daily.Breakfast,
                Lunch = daily.Lunch,
                Dinner = daily.Dinner,
                Snack = daily.Snack,
                TCB = daily.TCB,
                TDS = daily.TDS,
                TW = daily.TW,
                Macros = daily.Macros,
                Updated = daily.Updated,
                Created = daily.Created,
                ClientId = daily.ClientId
            });
        }

        public async Task<IEnumerable<LoginDto>> GetLogin(string username, string password)
        {
            var logins = await this.clientRepository.GetLogin(username, password).ConfigureAwait(false);
            return logins.Select(login => new LoginDto
            {
                Id = login.Id,
                Username = login.Username,
                Password = login.Password,
                Active = login.Active,
                LastLogin = login.LastLogin,
                ClientId = login.ClientId
            });
        }

        public async Task<IEnumerable<LoginDto>> GetLogin(int clientId)
        {
            var logins = await this.clientRepository.GetLogin(clientId).ConfigureAwait(false);
            return logins.Select(login => new LoginDto
            {
                Id = login.Id,
                Username = login.Username,
                Password = login.Password,
                Active = login.Active,
                LastLogin = login.LastLogin,
                ClientId = login.ClientId
            });
        }

        public async Task<IEnumerable<MacrosPlanDto>> GetMacrosPlan(int clientId)
        {
            var macrosPlan = await this.clientRepository.FindMacrosPlan(clientId).ConfigureAwait(false);
            return macrosPlan.Select(plan => new MacrosPlanDto
            {
                Id = plan.Id,
                Height = plan.Height,
                Weight = plan.Weight,
                TargetWeight = plan.TargetWeight,
                MacroType = plan.MacroType,
                ActivityLevel = plan.ActivityLevel,
                CarbPercent = plan.CarbPercent,
                ProteinPercent = plan.ProteinPercent,
                FatPercent = plan.FatPercent,
                Updated = plan.Updated,
                Created = plan.Created,
                ClientId = plan.ClientId
            });
        }
    }
}
