using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Username { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; }
        
        [Required]
        public string PasswordHash { get; set; }
        
        [Required]
        public string Role { get; set; } // Độc giả, Thủ thư, Kế toán, Quản trị viên
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? LastLoginAt { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Foreign key to DocGia if this user is a reader
        public int? DocGiaId { get; set; }
        public DocGia? DocGia { get; set; }
    }
} 