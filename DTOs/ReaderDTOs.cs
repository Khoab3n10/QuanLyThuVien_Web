using System.ComponentModel.DataAnnotations;

namespace LibraryApi.DTOs
{
    public class ReaderDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string MembershipType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal MembershipFee { get; set; }
        public int MaxBooksAllowed { get; set; }
        public int MaxBorrowDays { get; set; }
        public int MaxRenewals { get; set; }
        public DateTime? SuspensionDate { get; set; }
        public int SuspensionDays { get; set; }
        public string? SuspensionReason { get; set; }
        public int? UserId { get; set; }
    }

    public class CreateReaderRequest
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Gender { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(15)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        public DateTime? DateOfBirth { get; set; }
        
        [StringLength(20)]
        public string MembershipType { get; set; } = "Regular";
        
        public decimal MembershipFee { get; set; } = 0;
        
        public int MaxBooksAllowed { get; set; } = 5;
        public int MaxBorrowDays { get; set; } = 14;
        public int MaxRenewals { get; set; } = 1;
    }

    public class UpdateReaderRequest
    {
        [StringLength(100)]
        public string? FullName { get; set; }
        
        [StringLength(10)]
        public string? Gender { get; set; }
        
        [StringLength(200)]
        public string? Address { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }
        
        [StringLength(15)]
        public string? PhoneNumber { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [StringLength(20)]
        public string? MembershipType { get; set; }
        
        public decimal? MembershipFee { get; set; }
        
        public int? MaxBooksAllowed { get; set; }
        public int? MaxBorrowDays { get; set; }
        public int? MaxRenewals { get; set; }
        
        [StringLength(20)]
        public string? Status { get; set; }
    }

    public class ReaderSearchRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MembershipType { get; set; }
        public string? Status { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class ReaderSearchResponse
    {
        public List<ReaderDto> Readers { get; set; } = new List<ReaderDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
} 