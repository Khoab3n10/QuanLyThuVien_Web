import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { apiRequest } from "../config/api";
import BorrowModal from "../components/BorrowModal";
import ReturnModal from "../components/ReturnModal";
import RenewalModal from "../components/RenewalModal";
import "./BorrowManagement.css";

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([]);
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [selectedBorrowForReturn, setSelectedBorrowForReturn] = useState(null);
  const [selectedBorrowForRenewal, setSelectedBorrowForRenewal] = useState(null);
  const [loading, setLoading] = useState(true);



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
    renewalCount: borrow.renewalCount || 0,
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
  const handleReturnBook = async (borrowId) => {
    // Tìm borrow hiện tại
    const borrow = borrows.find((b) => b.id === borrowId);
    if (!borrow) return;

      // Hiển thị modal phiếu trả sách
  setSelectedBorrowForReturn(borrow);
  setShowReturnModal(true);
};

  // Xử lý khi đóng modal trả sách
  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
    setSelectedBorrowForReturn(null);
  };

  // Xử lý khi xác nhận trả sách từ modal
  const handleConfirmReturn = (returnData) => {
    // Cập nhật trạng thái phiếu mượn trong danh sách local
    const updatedBorrows = borrows.map(b =>
      b.id === selectedBorrowForReturn.id
        ? { ...b, status: "returned", actualReturnDate: returnData.actualReturnDate }
        : b
    );
    setBorrows(updatedBorrows);
    setFilteredBorrows(updatedBorrows);
    
    // Đóng modal
    handleCloseReturnModal();
  };

  // Gia hạn sách
  const handleRenewBook = async (borrowId) => {
    const borrow = borrows.find((b) => b.id === borrowId);
    if (!borrow) return;

    // Kiểm tra xem sách có thể gia hạn không (chưa trả và chưa quá hạn)
    if (borrow.status === "returned") {
      alert("❌ Không thể gia hạn sách đã trả!");
      return;
    }

    const today = new Date();
    const dueDate = new Date(borrow.returnDate);
    if (today > dueDate) {
      alert("❌ Không thể gia hạn sách đã quá hạn! Vui lòng trả sách trước.");
      return;
    }

    // Kiểm tra số lần gia hạn (tối đa 2 lần)
    const renewalCount = borrow.renewalCount || 0;
    if (renewalCount >= 2) {
      alert("❌ Sách đã được gia hạn tối đa 2 lần! Không thể gia hạn thêm.");
      return;
    }

    // Hiển thị modal gia hạn
    setSelectedBorrowForRenewal(borrow);
    setShowRenewalModal(true);
  };

  // Xử lý khi đóng modal gia hạn
  const handleCloseRenewalModal = () => {
    setShowRenewalModal(false);
    setSelectedBorrowForRenewal(null);
  };

  // Xử lý khi xác nhận gia hạn từ modal
  const handleConfirmRenewal = (renewalData) => {
    // Cập nhật ngày hết hạn mới cho phiếu mượn
    const updatedBorrows = borrows.map(b =>
      b.id === selectedBorrowForRenewal.id
        ? { 
            ...b, 
            returnDate: renewalData.books[0].newDueDate,
            status: "renewed",
            renewalCount: (b.renewalCount || 0) + 1
          }
        : b
    );
    setBorrows(updatedBorrows);
    setFilteredBorrows(updatedBorrows);
    
    // Đóng modal
    handleCloseRenewalModal();
  };

  // Lưu phiếu mượn
  const handleSaveBorrow = async (borrowData) => {
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
      TenDocGia: borrowData.readerName,
      IdSach: borrowData.bookId,
      TenSach: borrowData.bookTitle,
      NgayMuon: borrowData.borrowDate,
      HanTra: borrowData.returnDate,
      NgayTra: borrowData.actualReturnDate || null,
      TrangThai: borrowData.status || "borrowed",
      GhiChu: borrowData.notes || "",
    };

    try {
      if (editingBorrow && editingBorrow.id) {
        // Cập nhật phiếu mượn hiện tại
        await apiRequest(`/api/PhieuMuon/${editingBorrow.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...requestData, id: editingBorrow.id }),
        });
      } else {
        // Thêm phiếu mượn mới
        await apiRequest('/api/PhieuMuon', {
          method: "POST",
          body: JSON.stringify(requestData),
        });
      }
      
      setShowModal(false);
      setEditingBorrow(null);
      refreshBorrows();
    } catch (err) {
      console.error("Lỗi khi lưu phiếu mượn:", err);
      alert("Có lỗi xảy ra khi lưu phiếu mượn. Vui lòng thử lại.");
    }
  };

  const refreshBorrows = async () => {
    setLoading(true);
    
    try {
      const data = await apiRequest('/api/PhieuMuon');
      const mappedBorrows = data.map(mapBorrowData);
      setBorrows(mappedBorrows);
      setFilteredBorrows(mappedBorrows);
    } catch (err) {
      console.error("Lỗi khi tải phiếu mượn:", err);
      // Fallback data khi API không có sẵn
      setBorrows([]);
      setFilteredBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBorrow = async (borrowId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?")) {
      try {
        await apiRequest(`/api/PhieuMuon/${borrowId}`, {
          method: "DELETE",
        });
        refreshBorrows();
      } catch (err) {
        console.error("Lỗi khi xóa phiếu mượn:", err);
        alert("Có lỗi xảy ra khi xóa phiếu mượn. Vui lòng thử lại.");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "borrowed":
        return <span className="badge badge-info">Đang mượn</span>;
      case "returned":
        return <span className="badge badge-success">Đã trả</span>;
      case "renewed":
        return <span className="badge badge-warning">Đã gia hạn</span>;
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
              placeholder="Tìm kiếm theo tên thành viên, tên sách hoặc trạng thái..."
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
                <th>Thành viên</th>
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
                  <td>#{borrow.id?.toString().padStart(4, "0")}</td>
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
                      {(borrow.status === "borrowed" || borrow.status === "renewed") && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleReturnBook(borrow.id)}
                            title="Xác nhận trả sách"
                          >
                            <FaCheck />
                            <span className="btn-text">Xác nhận trả</span>
                          </button>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleRenewBook(borrow.id)}
                            title="Gia hạn mượn sách"
                          >
                            <FaClock />
                            <span className="btn-text">Gia hạn</span>
                          </button>
                        </>
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

      {showReturnModal && selectedBorrowForReturn && (
        <ReturnModal
          isOpen={showReturnModal}
          onClose={handleCloseReturnModal}
          borrowData={selectedBorrowForReturn}
          onConfirm={handleConfirmReturn}
        />
      )}

      {showRenewalModal && selectedBorrowForRenewal && (
        <RenewalModal
          isOpen={showRenewalModal}
          onClose={handleCloseRenewalModal}
          borrowData={selectedBorrowForRenewal}
          onConfirm={handleConfirmRenewal}
        />
      )}
    </div>
  );
};

export default BorrowManagement;
