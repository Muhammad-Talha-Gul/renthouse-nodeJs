import React from 'react';
import { Pagination } from 'react-bootstrap';
import './Pagination.css';

const CustomPagination = ({
    pagination,
    onPageChange,
    className = '',
    compact = false
}) => {
    const totalPages = pagination?.total_pages || 1;
    const currentPage = pagination?.page || 1;
    const totalItems = pagination?.total || 0;

    if (totalPages <= 1) return null;

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        rangeWithDots.push(1);

        if (currentPage - delta > 2) {
            rangeWithDots.push('...');
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...');
        }

        if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const handlePageChange = (newPage) => {
        if (!newPage || newPage < 1 || newPage > totalPages) return;
        onPageChange(newPage);
    };

    return (
        <div className={`d-flex justify-content-center align-items-center mt-4 ${className}`}>
            <div className={`theme-pagination ${compact ? 'compact' : ''}`}>
                <Pagination className="mb-0">
                    {/* Previous Page */}
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-arrow"
                    />

                    {/* Page Numbers */}
                    {getVisiblePages().map((page, index) => (
                        <Pagination.Item
                            key={index}
                            active={page === currentPage}
                            disabled={page === '...'}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            className={`pagination-item ${page === currentPage ? 'active' : ''}`}
                        >
                            {page}
                        </Pagination.Item>
                    ))}

                    {/* Next Page */}
                    <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-arrow"
                    />
                </Pagination>
            </div>
        </div>
    );
};

export default CustomPagination;