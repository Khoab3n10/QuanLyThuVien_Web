namespace LibraryApi.Models
{
    public class DashboardSummaryDto
    {
        public int TotalBooks { get; set; }
        public int TotalReaders { get; set; }
        public int BooksBorrowed { get; set; }
        public int BooksOverdue { get; set; }
    }
} 