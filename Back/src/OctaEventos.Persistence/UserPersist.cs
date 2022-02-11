using OctaEventos.Domain.Identity;
using OctaEventos.Persistence.Contextos;
using OctaEventos.Persistence.Contratos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OctaEventos.Persistence
{
    public class UserPersist : GeralPersist, IUserPersist
    {
        private readonly OctaContext context;
        public UserPersist(OctaContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<IEnumerable<User>> GetUserAsync()
        {
            return await this.context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await this.context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUserNameAsync(string userName)
        {
           return await this.context.Users
                                    .SingleOrDefaultAsync(user => user.UserName == userName.ToLower());
        }

    }
}