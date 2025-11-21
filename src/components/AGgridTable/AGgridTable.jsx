// src/components/Common/DataTable/DataTable.jsx
import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Badge } from 'react-bootstrap';
import './AGgridTable.css';

const AGgridTable = ({
    rowData = [],
    columnDefs = [],
    onEdit,
    onDelete,
    onRowClick,
    loading = false,
    height = '500px'
}) => {
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 100,
    }), []);

    const actionCellRenderer = (params) => {
        return (
            <div className="table-actions">
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(params.data)}
                >
                    Edit
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(params.data.id)}
                >
                    Delete
                </Button>
            </div>
        );
    };

    const badgeCellRenderer = (params) => {
        const value = params.value;
        const isActive = value === 1 || value === '1' || value === true;
        return (
            <Badge bg={isActive ? 'success' : 'secondary'}>
                {isActive ? 'Active' : 'Inactive'}
            </Badge>
        );
    };

    const iconCellRenderer = (params) => {
        return <div className="table-icon">{params.value}</div>;
    };

    const enhancedColumnDefs = columnDefs.map(col => {
        if (col.field === 'actions') {
            return {
                ...col,
                cellRenderer: actionCellRenderer,
                filter: false,
                sortable: false
            };
        }
        if (col.field === 'active_status' || col.field === 'status') {
            return {
                ...col,
                cellRenderer: badgeCellRenderer
            };
        }
        if (col.field === 'icon') {
            return {
                ...col,
                cellRenderer: iconCellRenderer
            };
        }
        return col;
    });

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="ag-theme-alpine data-table-container" style={{ height }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={enhancedColumnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                suppressCellFocus={true}
                onRowClicked={onRowClick}
                enableCellTextSelection={true}
                ensureDomOrder={true}
            />
        </div>
    );
};

export default AGgridTable;