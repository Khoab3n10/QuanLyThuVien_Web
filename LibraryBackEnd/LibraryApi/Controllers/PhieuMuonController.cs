using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuMuonController : ControllerBase
    {
        private readonly LibraryContext _context;

        public PhieuMuonController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/PhieuMuon
        [HttpGet]
        public ActionResult<IEnumerable<PhieuMuon>> GetAll()
        {
            return Ok(_context.PhieuMuons.ToList());
        }

        // GET: api/PhieuMuon/5
        [HttpGet("{id}")]
        public ActionResult<PhieuMuon> GetById(int id)
        {
            var phieu = _context.PhieuMuons.Find(id);
            if (phieu == null)
                return NotFound();
            return Ok(phieu);
        }

        // POST: api/PhieuMuon
        [HttpPost]
        public ActionResult<PhieuMuon> Create(PhieuMuon phieu)
        {
            _context.PhieuMuons.Add(phieu);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = phieu.Id }, phieu);
        }

        // PUT: api/PhieuMuon/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, PhieuMuon phieu)
        {
            if (id != phieu.Id)
                return BadRequest();

            _context.Entry(phieu).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/PhieuMuon/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var phieu = _context.PhieuMuons.Find(id);
            if (phieu == null)
                return NotFound();

            _context.PhieuMuons.Remove(phieu);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
