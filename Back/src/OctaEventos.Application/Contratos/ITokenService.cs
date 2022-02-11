using OctaEventos.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctaEventos.Application.Contratos
{
    public interface ITokenService
    {
        Task<string> CreateToken (UserUpdateDto userUpdateDto);
    }
}