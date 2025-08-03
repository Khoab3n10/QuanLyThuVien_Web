using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class BorrowTicket
    {
        [Key]
        public int Id { get; set; }
        public int ReaderId { get; set; }
        public int BookId { get; set; }
        public DateTime BorrowDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime? ActualReturnDate { get; set; }
        public int RenewalCount { get; set; } = 0;
        public decimal? FineAmount { get; set; }
        public bool IsPaid { get; set; } = false;
        public DateTime? PaymentDate { get; set; }
        public string? PaymentMethod { get; set; }
        public string? ReceiptNumber { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Active";
        public string? Notes { get; set; }

        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
        public ICollection<RenewalTicket> RenewalTickets { get; set; } = new List<RenewalTicket>();
        public ICollection<Fine> Fines { get; set; } = new List<Fine>();
    }

    public class ReturnTicket
    {
        [Key]
        public int Id { get; set; }
        public int ReaderId { get; set; }
        public int BookId { get; set; }
        public int? BorrowTicketId { get; set; }
        public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpectedReturnDate { get; set; }
        public bool IsLate { get; set; } = false;
        public int DaysLate { get; set; } = 0;
        public decimal? FineAmount { get; set; }
        public bool FinePaid { get; set; } = false;
        public DateTime? FinePaymentDate { get; set; }
        public string? FinePaymentMethod { get; set; }
        public string? FineReceiptNumber { get; set; }
        public string? BookCondition { get; set; }
        public string? DamageDescription { get; set; }
        public decimal? DamageFine { get; set; }
        public bool DamageFinePaid { get; set; } = false;
        public DateTime? DamageFinePaymentDate { get; set; }
        public string? DamageFinePaymentMethod { get; set; }
        public string? DamageFineReceiptNumber { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Completed";
        public string? Notes { get; set; }

        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
        public BorrowTicket? BorrowTicket { get; set; }
    }

    public class Reservation
    {
        [Key]
        public int Id { get; set; }
        public int ReaderId { get; set; }
        public int BookId { get; set; }
        public DateTime ReservationDate { get; set; } = DateTime.UtcNow;
        public DateTime ExpiryDate { get; set; }
        public DateTime? PickupDate { get; set; }
        public DateTime? CancellationDate { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Active";
        public string? Notes { get; set; }

        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }

    public class RenewalTicket
    {
        [Key]
        public int Id { get; set; }
        public int ReaderId { get; set; }
        public int BookId { get; set; }
        public int BorrowTicketId { get; set; }
        public DateTime RenewalDate { get; set; } = DateTime.UtcNow;
        public DateTime OldDueDate { get; set; }
        public DateTime NewDueDate { get; set; }
        public int RenewalNumber { get; set; }
        public string? Reason { get; set; }
        public bool IsApproved { get; set; } = true;
        public DateTime? ApprovalDate { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Approved";
        public string? Notes { get; set; }

        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
        public BorrowTicket BorrowTicket { get; set; } = null!;
    }

    public class Fine
    {
        [Key]
        public int Id { get; set; }
        public int ReaderId { get; set; }
        public int? BorrowTicketId { get; set; }
        public int? ReturnTicketId { get; set; }
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime FineDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public bool IsPaid { get; set; } = false;
        public DateTime? PaymentDate { get; set; }
        public string? PaymentMethod { get; set; }
        public string? ReceiptNumber { get; set; }
        public string? PaymentNotes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Pending";
        public string? Notes { get; set; }

        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public BorrowTicket? BorrowTicket { get; set; }
        public ReturnTicket? ReturnTicket { get; set; }
    }

    public class InventoryCheck
    {
        [Key]
        public int Id { get; set; }
        public int BookId { get; set; }
        public int? CheckedByUserId { get; set; }
        public DateTime CheckDate { get; set; } = DateTime.UtcNow;
        public int ExpectedQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public int MissingQuantity { get; set; }
        public int DamagedQuantity { get; set; }
        public string? Location { get; set; }
        public string? Condition { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Completed";
        public string? Notes { get; set; }

        // Navigation properties
        public Book Book { get; set; } = null!;
        public User? CheckedByUser { get; set; }
    }

    public class PurchaseProposal
    {
        [Key]
        public int Id { get; set; }
        public int? ProposedByUserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Publisher { get; set; }
        public int? PublicationYear { get; set; }
        public string? ISBN { get; set; }
        public int ProposedQuantity { get; set; } = 1;
        public decimal? EstimatedPrice { get; set; }
        public decimal? TotalEstimatedCost { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime ProposalDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewDate { get; set; }
        public int? ReviewedByUserId { get; set; }
        public bool IsApproved { get; set; } = false;
        public DateTime? ApprovalDate { get; set; }
        public string? ApprovalNotes { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public decimal? ActualCost { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
        public string? Status { get; set; } = "Pending";
        public string? Notes { get; set; }

        // Navigation properties
        public User? ProposedByUser { get; set; }
        public User? ReviewedByUser { get; set; }
        public Book? Book { get; set; }
    }

    public class ActivityLog
    {
        [Key]
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? SessionId { get; set; }

        // Navigation properties
        public User? User { get; set; }
    }
} 