import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import BorrowModal from "../components/BorrowModal";
import "./BorrowManagement.css";

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([]);
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl =
    "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/PhieuMuon";

  const mapBorrowData = (borrow) => ({
    id: borrow.id,
    readerId: borrow.idDocGia,
    readerName: borrow.docGia?.tenDocGia || borrow.tenDocGia || "",
    bookId: borrow.idSach,
    bookTitle: borrow.sach?.tenSach || borrow.tenSach || "",
    borrowDate: new Date(borrow.ngayMuon).toISOString().split("T")[0],
    returnDate: new Date(borrow.hanTra).toISOString().split("T")[0],
    actualReturnDate: borrow.ngayTra
      ? new Date(borrow.ngayTra).toISOString().split("T")[0]
      : null,
    status: borrow.trangThai,
    notes: borrow.ghiChu || "",
  });

  // Tải dữ liệu phiếu mượn từ API
  useEffect(() => {
    refreshBorrows();
  }, []);

  // Lọc phiếu mượn khi tìm kiếm
  useEffect(() => {
    const filtered = borrows.filter(
      (borrow) =>
        borrow.readerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.status.includes(searchTerm.toLowerCase())
    );
    setFilteredBorrows(filtered);
  }, [searchTerm, borrows]);

  const handleAddBorrow = () => {
    setEditingBorrow(null);
    setShowModal(true);
  };

  const handleEditBorrow = (borrow) => {
    setEditingBorrow(borrow);
    setShowModal(true);
  };

  // Trả sách
  const handleReturnBook = (borrowId) => {
    // Tìm borrow hiện tại
    const borrow = borrows.find((b) => b.id === borrowId);
    if (!borrow) return;

    // Gửi yêu cầu cập nhật trạng thái lên API
    fetch(`${apiUrl}/${borrowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: borrowId,
        idDocGia: borrow.readerId,
        idSach: borrow.bookId,
        ngayMuon: borrow.borrowDate,
        hanTra: borrow.returnDate,
        ngayTra: new Date().toISOString().split("T")[0],
        trangThai: "returned",
        ghiChu: borrow.notes || "",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        refreshBorrows();
      })
      .catch((err) => console.error("Lỗi khi trả sách:", err));
  };

  // Lưu phiếu mượn
  const handleSaveBorrow = (borrowData) => {
    if (
      !borrowData.readerId ||
      !borrowData.bookId ||
      !borrowData.borrowDate ||
      !borrowData.returnDate
    ) {
      alert("Vui lòng điền đầy đủ thông tin phiếu mượn.");
      return;
    }

    if (new Date(borrowData.returnDate) < new Date(borrowData.borrowDate)) {
      alert("Ngày trả không thể trước ngày mượn.");
      return;
    }

    const requestData = {
      IdDocGia: borrowData.readerId,
      TenDocGia: borrowData.readerName, // Thêm dòng này
      IdSach: borrowData.bookId,
      TenSach: borrowData.bookTitle, // Thêm dòng này
      NgayMuon: borrowData.borrowDate,
      HanTra: borrowData.returnDate,
      NgayTra: borrowData.actualReturnDate || null,
      TrangThai: borrowData.status || "borrowed",
      GhiChu: borrowData.notes || "",
    };

    if (editingBorrow && editingBorrow.id) {
      // Cập nhật phiếu mượn hiện tại
      fetch(`${apiUrl}/${editingBorrow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...requestData, id: editingBorrow.id }),
      })
        .then((res) => res.json())
        .then(() => {
          setShowModal(false);
          setEditingBorrow(null);
          refreshBorrows();
        })
        .catch((err) => console.error("Lỗi khi cập nhật phiếu mượn:", err));
    } else {
      // Thêm phiếu mượn mới
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
        .then((res) => {
          if (!res.ok) {
            res
              .text()
              .then((text) => alert("Lỗi khi thêm phiếu mượn: " + text));
            return;
          }
          return res.json();
        })
        .then(() => {
          setShowModal(false);
          setEditingBorrow(null);
          refreshBorrows();
        })
        .catch((err) => console.error("Lỗi khi thêm phiếu mượn:", err));
    }
  };

  const refreshBorrows = () => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const mappedBorrows = data.map(mapBorrowData);
        setBorrows(mappedBorrows);
        setFilteredBorrows(mappedBorrows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải phiếu mượn:", err);
        setLoading(false);
      });
  };

  const handleDeleteBorrow = (borrowId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?")) {
      fetch(`${apiUrl}/${borrowId}`, {
        method: "DELETE",
      })
        .then(() => {
          refreshBorrows();
        })
        .catch((err) => console.error("Lỗi khi xóa phiếu mượn:", err));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "borrowed":
        return <span className="badge badge-info">Đang mượn</span>;
      case "returned":
        return <span className="badge badge-success">Đã trả</span>;
      case "overdue":
        return <span className="badge badge-danger">Quá hạn</span>;
      default:
        return <span className="badge badge-secondary">Không xác định</span>;
    }
  };

  const isOverdue = (returnDate) => {
    return new Date(returnDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="borrow-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý mượn trả</h1>
        <p className="page-subtitle">
          Quản lý phiếu mượn trả sách trong thư viện
        </p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên độc giả, tên sách hoặc trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddBorrow}>
            <FaPlus /> Thêm phiếu mượn
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Độc giả</th>
                <th>Sách</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Ngày trả thực</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow) => (
                <tr
                  key={borrow.id}
                  className={
                    isOverdue(borrow.returnDate) && borrow.status === "borrowed"
                      ? "overdue-row"
                      : ""
                  }
                >
                  <td>#{borrow.id.toString().padStart(4, "0")}</td>
                  <td>
                    <div className="borrow-reader">
                      <strong>{borrow.readerName}</strong>
                      <small>ID: #{borrow.readerId}</small>
                    </div>
                  </td>
                  <td>
                    <div className="borrow-book">
                      <strong>{borrow.bookTitle}</strong>
                      <small>ID: #{borrow.bookId}</small>
                    </div>
                  </td>
                  <td>{borrow.borrowDate}</td>
                  <td
                    className={
                      isOverdue(borrow.returnDate) &&
                      borrow.status === "borrowed"
                        ? "overdue-date"
                        : ""
                    }
                  >
                    {borrow.returnDate}
                  </td>
                  <td>{borrow.actualReturnDate || "-"}</td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td>
                    <div className="borrow-notes">
                      {borrow.notes || "Không có ghi chú"}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {borrow.status === "borrowed" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturnBook(borrow.id)}
                          title="Trả sách"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditBorrow(borrow)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBorrow(borrow.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBorrows.length === 0 && (
          <div className="empty-state">
            <h3>Không tìm thấy phiếu mượn</h3>
            <p>Không có phiếu mượn nào phù hợp với từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

      {showModal && (
        <BorrowModal
          borrow={editingBorrow}
          onSave={handleSaveBorrow}
          onClose={() => {
            setShowModal(false);
            setEditingBorrow(null);
          }}
        />
      )}
    </div>
  );
};

export default BorrowManagement;
