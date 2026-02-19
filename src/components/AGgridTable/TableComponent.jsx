import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import './TableComponent.css';

const TableComponent = ({
    data = [],
    columns = [],
    pagination = {},
    currentPage = 1,
    hasPermission = () => false,
    onEdit = () => { },
    onDelete = () => { },
    onView = null, // Optional view action
    onRowClick = null, // Optional row click handler
    isLoading = false,
    striped = true,
    hoverable = true,
    selectable = false, // Enable row selection
    onSelectionChange = null,
    sortable = false,
    onSort = null
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef(null);

    // Handle scroll for gradient effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isScrolled = scrollTop > 0;
            
            if (isScrolled) {
                container.classList.add('scrolled');
            } else {
                container.classList.remove('scrolled');
            }
            
            setScrollPosition(scrollTop);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const tableColumns = useMemo(() => {
        const configKeys = columns.map(c => c.key);
        const dataKeys = data.length > 0 ? Object.keys(data[0]) : [];

        const missingColumns = dataKeys
            .filter(key => !configKeys.includes(key) && key !== 'id')
            .map(key => ({
                key,
                label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                sortable: sortable
            }));

        // Filter hidden columns
        const visibleCols = [...columns, ...missingColumns].filter(col => !col.hidden);

        // Format created_at column
        let createdAtCol = visibleCols.find(c => c.key === 'created_at');
        if (!createdAtCol) {
            createdAtCol = { 
                key: 'created_at', 
                label: 'Created At',
                sortable: sortable 
            };
        }
        createdAtCol.render = (value, row) => {
            if (!row.created_at) return '-';
            const date = new Date(row.created_at);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        };

        // Format icon column with better styling
        const iconCol = visibleCols.find(c => c.key === 'icon');
        if (iconCol) {
            iconCol.render = (value) => (
                <span className="icon-cell" role="img" aria-label="category icon">
                    {value || '🏠'}
                </span>
            );
        }

        // Remove created_at and id from main array
        const otherCols = visibleCols.filter(c => c.key !== 'created_at' && c.key !== 'id' && c.key !== 'icon');

        // Actions column with enhanced buttons
        const actionsCol = {
            key: 'actions',
            label: 'Actions',
            render: (value, row) => (
                <div className="table-actions">
                    {onView && (
                        <Button 
                            size="sm" 
                            variant="outline-success" 
                            onClick={(e) => { e.stopPropagation(); onView(row); }}
                            title="View details"
                        >
                            <i className="fas fa-eye"></i>
                        </Button>
                    )}
                    {hasPermission('update') && (
                        <Button 
                            size="sm" 
                            variant="primary" 
                            onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                            title="Edit"
                        >
                            <i className="fas fa-edit"></i> 
                            <span className="d-none d-md-inline"> Edit</span>
                        </Button>
                    )}
                    {hasPermission('delete') && (
                        <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}
                            title="Delete"
                        >
                            <i className="fas fa-trash"></i>
                            <span className="d-none d-md-inline"> Delete</span>
                        </Button>
                    )}
                </div>
            ),
            headerStyle: { textAlign: 'center', width: '200px' },
            cellStyle: { textAlign: 'center' },
        };

        // ID column
        const idCol = {
            key: 'id',
            label: 'ID',
            render: (v, row) => (
                <span className="badge bg-light text-dark">#{row.id}</span>
            ),
            sortable: sortable,
            width: '80px'
        };

        // Return in desired order
        return [createdAtCol, ...otherCols, actionsCol, idCol];
    }, [columns, data, hasPermission, onEdit, onDelete, onView, sortable]);

    const handleRowSelect = (rowId) => {
        if (!selectable) return;
        
        setSelectedRows(prev => {
            const newSelection = prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId];
            
            if (onSelectionChange) {
                onSelectionChange(newSelection);
            }
            
            return newSelection;
        });
    };

    const handleSelectAll = () => {
        if (!selectable) return;
        
        const newSelection = selectedRows.length === data.length
            ? []
            : data.map(row => row.id);
        
        setSelectedRows(newSelection);
        if (onSelectionChange) {
            onSelectionChange(newSelection);
        }
    };

    const getRowClass = (index, row) => {
        let classes = [];
        if (striped && index % 2 === 0) classes.push('striped-row');
        if (hoverable) classes.push('hoverable');
        if (selectedRows.includes(row.id)) classes.push('selected-row');
        return classes.join(' ');
    };

    return (
        <div className="category-table-container" ref={containerRef}>
            <div className="table-scroll-wrapper">
                <table className="category-table">
                    <thead>
                        <tr>
                            {selectable && (
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === data.length && data.length > 0}
                                        onChange={handleSelectAll}
                                        className="form-check-input"
                                    />
                                </th>
                            )}
                            <th style={{ width: '60px' }}>#</th>
                            {tableColumns.map(col => (
                                <th 
                                    key={col.key} 
                                    style={{ 
                                        ...col.headerStyle,
                                        ...(col.width && { width: col.width }),
                                        cursor: col.sortable ? 'pointer' : 'default'
                                    }}
                                    className={col.sortable ? 'sortable' : ''}
                                    onClick={() => col.sortable && onSort && onSort(col.key)}
                                >
                                    {col.label}
                                    {col.sortable && (
                                        <span className="sort-icon">
                                            <i className="fas fa-sort ms-2 opacity-50"></i>
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <tr key={`loading-${idx}`} className="loading-row">
                                    {selectable && <td><div className="skeleton-checkbox"></div></td>}
                                    <td><div className="skeleton-text"></div></td>
                                    {tableColumns.map(col => (
                                        <td key={col.key}>
                                            <div className="skeleton-text"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr className="empty-state">
                                <td colSpan={tableColumns.length + (selectable ? 2 : 1)}>
                                    <div className="empty-state-content">
                                        <i className="fas fa-folder-open"></i>
                                        <h4>No Data Found</h4>
                                        <p>There are no records to display at the moment.</p>
                                        {hasPermission('create') && (
                                            <Button 
                                                variant="success" 
                                                onClick={() => onEdit(null)}
                                                className="mt-3"
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Add New Category
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr 
                                    key={row.id || idx} 
                                    className={getRowClass(idx, row)}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {selectable && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleRowSelect(row.id)}
                                                className="form-check-input"
                                            />
                                        </td>
                                    )}
                                    <td>
                                        <span className="row-number">
                                            {((currentPage || 1) - 1) * (pagination?.per_page || 50) + (idx + 1)}
                                        </span>
                                    </td>
                                    {tableColumns.map(col => (
                                        <td 
                                            key={col.key} 
                                            className={col.className || ''} 
                                            style={col.cellStyle || {}}
                                        >
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Optional floating action button for bulk actions */}
            {selectedRows.length > 0 && (
                <div className="bulk-actions-floating">
                    <span className="selected-count">{selectedRows.length} selected</span>
                    <Button size="sm" variant="danger" onClick={() => {
                        if (window.confirm(`Delete ${selectedRows.length} items?`)) {
                            selectedRows.forEach(id => onDelete(id));
                            setSelectedRows([]);
                        }
                    }}>
                        <i className="fas fa-trash me-2"></i>
                        Delete Selected
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TableComponent;