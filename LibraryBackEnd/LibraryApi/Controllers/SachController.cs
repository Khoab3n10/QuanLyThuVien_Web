using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SachController : ControllerBase
    {
        private readonly LibraryContext _context;

        public SachController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sach>>> GetBooks()
        {
            return await _context.Saches.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sach>> GetBook(int id)
        {
            var book = await _context.Saches.FindAsync(id);
            if (book == null) return NotFound();
            return book;
        }

        [HttpPost]
        public async Task<ActionResult<Sach>> CreateBook(Sach book)
        {
            _context.Saches.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Sach book)
        {
            if (id != book.Id) return BadRequest();
            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Saches.FindAsync(id);
            if (book == null) return NotFound();
            _context.Saches.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
