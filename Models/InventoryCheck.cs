using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class InventoryCheck
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int BookId { get; set; }
        
        public DateTime CheckDate { get; set; } = DateTime.UtcNow;
        public int ExpectedQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public int Difference { get; set; } // Actual - Expected
        
        [StringLength(20)]
        public string Status { get; set; } = "Checked"; // Checked, Discrepancy, Resolved
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public int? CheckedByUserId { get; set; }
        
        // Navigation properties
        public Book Book { get; set; } = null!;
        public User? CheckedByUser { get; set; }
    }
} 