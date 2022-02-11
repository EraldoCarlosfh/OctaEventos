using System.Collections.Generic;
using System.Threading.Tasks;
using OctaEventos.Domain.Identity;

namespace OctaEventos.Persistence.Contratos
{
    public interface IUserPersist : IGeralPersist
    {
        Task<IEnumerable<User>> GetUserAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUserNameAsync(string userName);
    }
}