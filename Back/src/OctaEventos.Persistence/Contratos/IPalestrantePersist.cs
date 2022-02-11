using System.Threading.Tasks;
using OctaEventos.Domain;
using OctaEventos.Persistence.Pagination;

namespace OctaEventos.Persistence.Contratos
{
    public interface IPalestrantePersist : IGeralPersist
    {     
         Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
         Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
    }
}