using System;
namespace Fit2Fitter.Database.Data
{
    public interface IDatabaseManager
    {
        DatabaseContext GetDatabaseContext();
    }
}
