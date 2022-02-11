using System.Threading.Tasks;
using OctaEventos.Domain;
using OctaEventos.Persistence.Pagination;

namespace OctaEventos.Persistence.Contratos
{
    public interface IEventoPersist : IGeralPersist
    {     
         Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);        
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false); 
    }
}