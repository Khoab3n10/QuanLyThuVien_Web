using System.ComponentModel.DataAnnotations;

namespace LibraryApi.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Publisher { get; set; }
        public int? PublicationYear { get; set; }
        public string? ISBN { get; set; }
        public int TotalCopies { get; set; }
        public int AvailableCopies { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? CoverImagePath { get; set; }
        public decimal? Price { get; set; }
        public DateTime DateAdded { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CreateBookRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Author { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? Publisher { get; set; }
        
        public int? PublicationYear { get; set; }
        
        [StringLength(20)]
        public string? ISBN { get; set; }
        
        [Range(1, int.MaxValue)]
        public int TotalCopies { get; set; } = 1;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public decimal? Price { get; set; }
    }

    public class UpdateBookRequest
    {
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(100)]
        public string? Author { get; set; }
        
        [StringLength(50)]
        public string? Category { get; set; }
        
        [StringLength(50)]
        public string? Publisher { get; set; }
        
        public int? PublicationYear { get; set; }
        
        [StringLength(20)]
        public string? ISBN { get; set; }
        
        [Range(1, int.MaxValue)]
        public int? TotalCopies { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public decimal? Price { get; set; }
        
        [StringLength(20)]
        public string? Status { get; set; }
    }

    public class BookSearchRequest
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public string? ISBN { get; set; }
        public string? Status { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class BookSearchResponse
    {
        public List<BookDto> Books { get; set; } = new List<BookDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
} 