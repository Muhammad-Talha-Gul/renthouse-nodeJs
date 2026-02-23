import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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
    onView = null,
    onRowClick = null,
    isLoading = false,
    striped = true,
    hoverable = true,
    selectable = false,
    onSelectionChange = null,
    sortable = false,
    onSort = null
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const containerRef = useRef(null);

    // Handle scroll for gradient effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop } = container;
            container.classList.toggle('scrolled', scrollTop > 0);
            setScrollPosition(scrollTop);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Safe data access with fallback
    const safeData = useMemo(() => {
        return Array.isArray(data) ? data.filter(row => row != null) : [];
    }, [data]);

    // Memoized table columns with improved rendering
    const tableColumns = useMemo(() => {
        const configKeys = columns.map(c => c.key);
        const firstRow = safeData[0] || {};
        const dataKeys = Object.keys(firstRow);

        // Generate missing columns from data
        const missingColumns = dataKeys
            .filter(key => !configKeys.includes(key) && !['id', 'created_at', 'updated_at'].includes(key))
            .map(key => ({
                key,
                label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                sortable,
                type: 'text'
            }));

        // Filter visible columns
        const visibleCols = [...columns, ...missingColumns].filter(col => !col?.hidden);

        // Format columns with enhanced rendering
        const formattedCols = visibleCols.map(col => {
            const newCol = { ...col };
            
            // Add type-based rendering
            if (!newCol.render) {
                newCol.render = (value, row) => {
                    if (value == null) return <span className="null-value">—</span>;
                    
                    // Auto-detect and format different data types
                    if (typeof value === 'boolean') {
                        return (
                            <span className={`badge ${value ? 'badge-success' : 'badge-secondary'}`}>
                                {value ? 'Active' : 'Inactive'}
                            </span>
                        );
                    }
                    
                    if (typeof value === 'number') {
                        return <span className="number-value">{value.toLocaleString()}</span>;
                    }
                    
                    if (typeof value === 'string' && value.match(/^\d+$/)) {
                        return <span className="badge badge-number">#{value}</span>;
                    }
                    
                    if (typeof value === 'string' && value.length > 50) {
                        return <span className="truncate-text" title={value}>{value.substring(0, 50)}...</span>;
                    }
                    
                    return value;
                };
            }
            
            return newCol;
        });

        // Created at column with enhanced formatting
        const createdAtCol = {
            key: 'created_at',
            label: 'Created',
            sortable,
            width: '180px',
            render: (value, row) => {
                if (!row?.created_at) return <span className="null-value">—</span>;
                
                try {
                    const date = new Date(row.created_at);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    let timeAgo = '';
                    if (diffDays === 1) timeAgo = 'yesterday';
                    else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
                    else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`;
                    else timeAgo = `${Math.floor(diffDays / 30)} months ago`;
                    
                    return (
                        <div className="date-cell">
                            <span className="date-full">
                                {date.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </span>
                            <span className="date-ago">{timeAgo}</span>
                        </div>
                    );
                } catch (e) {
                    return row.created_at;
                }
            }
        };

        // Icon column with emoji/icon support
        const iconColIndex = formattedCols.findIndex(c => c.key === 'icon');
        if (iconColIndex !== -1) {
            formattedCols[iconColIndex].render = (value) => (
                <div className="icon-cell-wrapper">
                    <span className="icon-cell" role="img" aria-label="icon">
                        {value || '📦'}
                    </span>
                </div>
            );
            formattedCols[iconColIndex].width = '80px';
        }

        // Filter out system columns
        const otherCols = formattedCols.filter(c => 
            !['id', 'created_at', 'updated_at'].includes(c.key)
        );

        // Enhanced actions column
        const actionsCol = {
            key: 'actions',
            label: 'Actions',
            width: '280px',
            headerStyle: { textAlign: 'center' },
            cellStyle: { textAlign: 'center' },
            render: (value, row) => (
                <div className="table-actions">
                    {onView && (
                        <Button 
                            size="sm" 
                            variant="outline-info" 
                            className="action-btn view-btn"
                            onClick={(e) => { e.stopPropagation(); onView(row); }}
                            title="View details"
                        >
                            <i className="fas fa-eye"></i>
                            <span className="btn-text">View</span>
                        </Button>
                    )}
                    {hasPermission('update') && (
                        <Button 
                            size="sm" 
                            variant="primary" 
                            className="action-btn edit-btn"
                            onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                            title="Edit"
                        >
                            <i className="fas fa-edit"></i>
                            <span className="btn-text">Edit</span>
                        </Button>
                    )}
                    {hasPermission('delete') && (
                        <Button 
                            size="sm" 
                            variant="danger" 
                            className="action-btn delete-btn"
                            onClick={(e) => { e.stopPropagation(); onDelete(row?.id); }}
                            title="Delete"
                        >
                            <i className="fas fa-trash"></i>
                            <span className="btn-text">Delete</span>
                        </Button>
                    )}
                </div>
            )
        };

        // ID column with badge
        const idCol = {
            key: 'id',
            label: 'ID',
            width: '100px',
            sortable,
            render: (v, row) => (
                <span className="id-badge">
                    <span className="id-prefix">#</span>
                    {row?.id || '—'}
                </span>
            )
        };

        return [createdAtCol, ...otherCols, actionsCol, idCol];
    }, [columns, safeData, hasPermission, onEdit, onDelete, onView, sortable]);

    // Row selection handlers
    const handleRowSelect = useCallback((rowId) => {
        if (!selectable || !rowId) return;
        
        setSelectedRows(prev => {
            const newSelection = prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId];
            
            onSelectionChange?.(newSelection);
            return newSelection;
        });
    }, [selectable, onSelectionChange]);

    const handleSelectAll = useCallback(() => {
        if (!selectable) return;
        
        const newSelection = selectedRows.length === safeData.length
            ? []
            : safeData.map(row => row?.id).filter(Boolean);
        
        setSelectedRows(newSelection);
        onSelectionChange?.(newSelection);
    }, [selectable, safeData, selectedRows.length, onSelectionChange]);

    const getRowClass = useCallback((index, row) => {
        const classes = [];
        if (striped && index % 2 === 0) classes.push('striped-row');
        if (hoverable) classes.push('hoverable');
        if (row?.id && selectedRows.includes(row.id)) classes.push('selected-row');
        if (onRowClick) classes.push('clickable');
        return classes.join(' ');
    }, [striped, hoverable, selectedRows, onRowClick]);

    // Handle sort
    const handleSort = useCallback((key) => {
        if (!sortable || !onSort) return;
        
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
        onSort(key, direction);
    }, [sortable, onSort, sortConfig]);

    // Render loading skeleton
    const renderSkeleton = () => (
        Array.from({ length: 5 }).map((_, idx) => (
            <tr key={`loading-${idx}`} className="skeleton-row">
                {selectable && <td><div className="skeleton-checkbox"></div></td>}
                <td><div className="skeleton-number"></div></td>
                {tableColumns.map(col => (
                    <td key={col.key}>
                        <div className="skeleton-cell" style={{ width: col.width || '100px' }}></div>
                    </td>
                ))}
            </tr>
        ))
    );

    // Render empty state
    const renderEmptyState = () => (
        <tr className="empty-state-row">
            <td colSpan={tableColumns.length + (selectable ? 2 : 1)}>
                <div className="empty-state-content">
                    <div className="empty-icon">📊</div>
                    <h4>No Data Available</h4>
                    <p>Start by adding your first record</p>
                    {hasPermission('create') && (
                        <Button 
                            variant="success" 
                            onClick={() => onEdit(null)}
                            className="empty-state-btn"
                        >
                            <i className="fas fa-plus"></i>
                            Add New Record
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="table-wrapper" ref={containerRef}>
            <div className="table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            {selectable && (
                                <th className="checkbox-col">
                                    <label className="checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            checked={safeData.length > 0 && selectedRows.length === safeData.length}
                                            onChange={handleSelectAll}
                                            className="table-checkbox"
                                        />
                                        <span className="checkbox-custom"></span>
                                    </label>
                                </th>
                            )}
                            <th className="row-number-col">#</th>
                            {tableColumns.map(col => (
                                <th 
                                    key={col.key} 
                                    className={`${col.className || ''} ${col.sortable ? 'sortable' : ''}`}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <span className="th-content">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="sort-icons">
                                                <i className={`fas fa-sort-up ${sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'active' : ''}`}></i>
                                                <i className={`fas fa-sort-down ${sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'active' : ''}`}></i>
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            renderSkeleton()
                        ) : safeData.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            safeData.map((row, idx) => (
                                <tr 
                                    key={row?.id || `row-${idx}`} 
                                    className={getRowClass(idx, row)}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {selectable && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <label className="checkbox-wrapper">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row?.id)}
                                                    onChange={() => handleRowSelect(row?.id)}
                                                    className="table-checkbox"
                                                    disabled={!row?.id}
                                                />
                                                <span className="checkbox-custom"></span>
                                            </label>
                                        </td>
                                    )}
                                    <td>
                                        <span className="row-number">
                                            {((currentPage || 1) - 1) * (pagination?.per_page || 20) + idx + 1}
                                        </span>
                                    </td>
                                    {tableColumns.map(col => (
                                        <td 
                                            key={col.key} 
                                            className={`cell-${col.type || 'text'} ${col.className || ''}`}
                                            style={col.cellStyle}
                                        >
                                            {col.render 
                                                ? col.render(row?.[col.key], row) 
                                                : row?.[col.key] ?? <span className="null-value">—</span>
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Bulk actions */}
            {selectedRows.length > 0 && (
                <div className="bulk-actions-bar">
                    <div className="bulk-info">
                        <span className="selected-count-badge">{selectedRows.length}</span>
                        <span>item{selectedRows.length !== 1 ? 's' : ''} selected</span>
                    </div>
                    <div className="bulk-buttons">
                        <Button 
                            size="sm" 
                            variant="danger" 
                            className="bulk-delete-btn"
                            onClick={() => {
                                if (window.confirm(`Delete ${selectedRows.length} selected item(s)?`)) {
                                    selectedRows.forEach(id => onDelete(id));
                                    setSelectedRows([]);
                                }
                            }}
                        >
                            <i className="fas fa-trash-alt"></i>
                            <span>Delete Selected</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableComponent;