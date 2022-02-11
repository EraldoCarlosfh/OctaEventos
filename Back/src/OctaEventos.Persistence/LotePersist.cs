using OctaEventos.Domain;
using OctaEventos.Persistence.Contextos;
using OctaEventos.Persistence.Contratos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OctaEventos.Persistence
{
    public class LotePersist : GeralPersist, ILotePersist
    {
        private readonly OctaContext _context;
        public LotePersist(OctaContext context) : base(context)
        {
            _context = context;           
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId);

            return await query.ToArrayAsync();
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int id)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId
                                     && lote.Id == id);

            return await query.FirstOrDefaultAsync();
        }

    }
}