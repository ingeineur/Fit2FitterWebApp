using Microsoft.EntityFrameworkCore;

namespace Fit2Fitter.Database.Data
{
    public class DatabaseManager:IDatabaseManager
    {
        /// <summary>
        /// The connection string.
        /// </summary>
        private readonly string connectionString;

        /// <summary>
        /// Initialises a new instance of the <see cref="DatabaseManager"/> class.
        /// </summary>
        /// <param name="connString">The base string.</param>
        public DatabaseManager(string connString) => this.connectionString = connString;

        /// <summary>
        /// The get database context.
        /// </summary>
        /// <returns>The <see cref="DatabaseContext"/>.</returns>
        public DatabaseContext GetDatabaseContext()
        {
            var options = this.CreateDbOptions();
            return new DatabaseContext(options);
        }

        /// <summary>
        /// The create db options.
        /// </summary>
        /// <returns>The <see cref="DbContextOptions"/>.</returns>
        private DbContextOptions<DatabaseContext> CreateDbOptions()
        {
            var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
            optionsBuilder.UseSqlServer(this.connectionString);
            return optionsBuilder.Options;
        }
    }
}
