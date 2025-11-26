import React, { useMemo } from 'react';
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
    isLoading = false,
    striped = true,
    hoverable = true
}) => {

    const tableColumns = useMemo(() => {
        const configKeys = columns.map(c => c.key);
        const dataKeys = data.length > 0 ? Object.keys(data[0]) : [];

        const missingColumns = dataKeys
            .filter(key => !configKeys.includes(key))
            .map(key => ({
                key,
                label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            }));

        // Filter hidden columns
        const visibleCols = [...columns, ...missingColumns].filter(col => !col.hidden);

        // Override or add created_at column and format date
        let createdAtCol = visibleCols.find(c => c.key === 'created_at');
        if (!createdAtCol) {
            createdAtCol = { key: 'created_at', label: 'Created At' };
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
                second: '2-digit',
                hour12: true,
            });
        };

        // Remove created_at and id columns from main array to avoid duplicates
        const otherCols = visibleCols.filter(c => c.key !== 'created_at' && c.key !== 'id');

        // Add Actions column BEFORE ID
        const actionsCol = {
            key: 'actions',
            label: 'Actions',
            render: (value, row) => (
                <>
                    {hasPermission('update') && (
                        <Button size="sm" variant="primary" onClick={() => onEdit(row)} style={{ marginRight: 5 }}>
                            <i className="fas fa-edit"></i> Edit
                        </Button>
                    )}
                    {hasPermission('delete') && (
                        <Button size="sm" variant="danger" onClick={() => onDelete(row.id)}>
                            <i className="fas fa-trash"></i> Delete
                        </Button>
                    )}
                </>
            ),
            headerStyle: { textAlign: 'center' },
            cellStyle: { textAlign: 'center' },
        };


        // Add ID column AFTER Actions
        const idCol = {
            key: 'id',
            label: 'ID',
            render: (v, row) => row.id,
        };

        // Final order: [created_at, ...others, actions, id]
        return [createdAtCol, ...otherCols, actionsCol, idCol];
    }, [columns, data, hasPermission, onEdit, onDelete]);

    const getRowClass = (index) => {
        let className = '';
        if (striped && index % 2 === 0) {
            className += ' striped-row';
        }
        if (hoverable) {
            className += ' hoverable';
        }
        return className.trim();
    };

    return (
        <div className="category-table-container">
            <div className="table-scroll-wrapper">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            {tableColumns.map(col => (
                                <th key={col.key} style={col.headerStyle || {}}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <tr key={`loading-${idx}`} className="loading">
                                    <td>{idx + 1}</td>
                                    {tableColumns.map(col => (
                                        <td key={col.key}>
                                            <div style={{
                                                height: '20px',
                                                background: 'var(--light-gray)',
                                                borderRadius: '4px',
                                                animation: 'pulse 2s infinite'
                                            }}></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={tableColumns.length + 1}>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '60px 20px',
                                        color: 'var(--text-light)',
                                        fontStyle: 'italic'
                                    }}>
                                        <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                                        <br />
                                        No data found.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={row.id || idx} className={getRowClass(idx)}>
                                    <td>{((currentPage || 1) - 1) * (pagination?.per_page || 50) + (idx + 1)}</td>
                                    {tableColumns.map(col => (
                                        <td key={col.key} className={col.className || ''} style={col.cellStyle || {}}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableComponent;
