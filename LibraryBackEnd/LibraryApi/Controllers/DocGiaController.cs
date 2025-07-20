using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocGiaController : Controller
    {
        private readonly LibraryContext _context;

        public DocGiaController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/DocGia
        [HttpGet]
        public ActionResult<IEnumerable<DocGia>> GetAll()
        {
            return Ok(_context.DocGias.ToList());
        }

        // GET: api/DocGia/5
        [HttpGet("{id}")]
        public ActionResult<DocGia> GetById(int id)
        {
            var docGia = _context.DocGias.Find(id);
            if (docGia == null)
                return NotFound();
            return Ok(docGia);
        }

        // POST: api/DocGia
        [HttpPost]
        public ActionResult<DocGia> Create(DocGia docGia)
        {
            _context.DocGias.Add(docGia);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = docGia.Id });
        }

        // PUT: api/DocGia/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, DocGia docGia)
        {
            if (id != docGia.Id) 
                return BadRequest();

            _context.Entry(docGia).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/DocGia/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var docGia = _context.DocGias.Find(id);
            if (docGia == null) 
                return NotFound();

            _context.DocGias.Remove(docGia);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
