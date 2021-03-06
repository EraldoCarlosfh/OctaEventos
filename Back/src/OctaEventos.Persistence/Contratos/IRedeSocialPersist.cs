using System.Threading.Tasks;
using OctaEventos.Domain;

namespace OctaEventos.Persistence.Contratos
{
    public interface IRedeSocialPersist : IGeralPersist
    {
        /// <summary>
        /// M?todo get que retornar? uma lista de lotes por eventoId. 
        /// </summary>
        /// <param name="eventoId">C?digo chave da tabela Evento</param>
        /// <returns>Array de Lotes</returns>
        Task<RedeSocial[]> GetAllByEventoIdAsync(int eventoId);
        Task<RedeSocial[]> GetAllByPalestranteIdAsync(int palestranteId);

        /// <summary>
        /// M?todo get que retornar? apenas 1 Lote
        /// </summary>
        /// <param name="eventoId">C?digo chave da tabela Evento</param>
        /// <param name="id">C?digo chave da tabela Lote</param>
        /// <returns>Apenas 1 lote</returns>
        Task<RedeSocial> GetRedeSocialEventoByIdsAsync(int eventoId, int id);
        Task<RedeSocial> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int id);
    }
}