using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class Reader
    {
        [Key]
        public int Id { get; set; }
        
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
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiryDate { get; set; }
        
        // Membership details
        [StringLength(20)]
        public string MembershipType { get; set; } = "Regular"; // Regular, VIP, Student, Teacher
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Suspended, Expired, Cancelled
        public decimal MembershipFee { get; set; } = 0;
        
        // Borrowing limits
        public int MaxBooksAllowed { get; set; } = 5;
        public int MaxBorrowDays { get; set; } = 14;
        public int MaxRenewals { get; set; } = 1;
        public int RenewalDays { get; set; } = 7;
        
        // Suspension details
        public DateTime? SuspensionDate { get; set; }
        public int SuspensionDays { get; set; } = 0;
        public string? SuspensionReason { get; set; }
        
        public DateTime? LastUpdated { get; set; }
        
        // Navigation properties
        public User? User { get; set; }
        public int? UserId { get; set; }
        public ICollection<BorrowTicket> BorrowTickets { get; set; } = new List<BorrowTicket>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<Fine> Fines { get; set; } = new List<Fine>();
        public ICollection<ReturnTicket> ReturnTickets { get; set; } = new List<ReturnTicket>();
        public ICollection<RenewalTicket> RenewalTickets { get; set; } = new List<RenewalTicket>();
    }
} 