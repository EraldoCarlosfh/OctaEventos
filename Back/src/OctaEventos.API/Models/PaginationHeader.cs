using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctaEventos.API.Models
{
    public class PaginationHeader
    {
        public PaginationHeader(int currenPage, int itemsPerPage, int totalItems, int totalPages)
        {
            this.CurrentPage = currenPage;
            this.ItemsPerPage = itemsPerPage;
            this.TotalItems = totalItems;
            this.TotalPages = totalPages;
        }
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
