import React from 'react';

function Pagination({ filter, onPageChange, totalPage }) {
    const { page } = filter;
    const currentPage = parseInt(page);
    
    // Không hiển thị pagination nếu chỉ có 1 trang
    if (totalPage <= 1) {
        return null;
    }

    const handlePageChange = (newPage) => {
        if (onPageChange && newPage >= 1 && newPage <= totalPage) {
            onPageChange(newPage);
        }
    };

    // Tạo danh sách các trang cần hiển thị
    const getPageNumbers = () => {
        const delta = 2; // Số trang hiển thị mỗi bên của trang hiện tại
        const pages = [];
        const rangeWithDots = [];

        // Luôn thêm trang đầu
        pages.push(1);

        // Thêm các trang xung quanh trang hiện tại
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i > 1 && i < totalPage) {
                pages.push(i);
            }
        }

        // Luôn thêm trang cuối
        if (totalPage > 1) {
            pages.push(totalPage);
        }

        // Loại bỏ trùng lặp và sắp xếp
        const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

        // Thêm dấu "..." nếu cần
        let prev = 0;
        uniquePages.forEach(pageNum => {
            if (pageNum - prev > 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(pageNum);
            prev = pageNum;
        });

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav aria-label="Page navigation" className="pt-4">
            <ul className="pagination justify-content-center justify-content-lg-end mb-0">
                {/* First Page Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                    >
                        <span>«</span>
                    </button>
                </li>

                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous"
                    >
                        <span>‹</span>
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((item, index) => {
                    if (item === '...') {
                        return (
                            <li key={`dots-${index}`} className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        );
                    }

                    return (
                        <li 
                            key={item}
                            className={`page-item ${item === currentPage ? 'active' : ''}`}
                        >
                            <button 
                                className="page-link"
                                onClick={() => handlePageChange(item)}
                            >
                                {item}
                            </button>
                        </li>
                    );
                })}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPage}
                        title="Next"
                    >
                        <span>›</span>
                    </button>
                </li>

                {/* Last Page Button */}
                <li className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => handlePageChange(totalPage)}
                        disabled={currentPage === totalPage}
                        title="Last Page"
                    >
                        <span>»</span>
                    </button>
                </li>
            </ul>

            {/* Page Info */}
            <div className="text-center text-muted mt-2" style={{ fontSize: '0.875rem' }}>
                Page {currentPage} of {totalPage}
            </div>
        </nav>
    );
}

export default Pagination;