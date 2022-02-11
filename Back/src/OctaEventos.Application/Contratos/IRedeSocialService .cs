using OctaEventos.Application.Dtos;
using System.Threading.Tasks;

namespace OctaEventos.Application.Contratos
{
   public interface IRedeSocialService
    {
        Task<RedeSocialDto[]> SaveRedeSocialByEvento(int eventoId, RedeSocialDto[] models);
        Task<RedeSocialDto[]> SaveRedeSocialByPalestrante(int palestranteId, RedeSocialDto[] models);
        Task<bool> DeleteRedeSocialByEvento(int eventoId, int redeSocialId);
        Task<bool> DeleteRedeSocialByPalestrante(int palestranteId, int redeSocialId);
        Task<RedeSocialDto[]> GetAllByEventoIdAsync(int eventoId);
        Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int palestranteId);
        Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId);
        Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId);
    }
}
