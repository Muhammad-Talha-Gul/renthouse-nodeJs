import React, { useMemo, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AGgridTable.css';

const ActionCellRenderer = (props) => {
    const { data, context } = props;
    const handleEdit = () => context?.onEdit && context.onEdit(data);
    const handleDelete = () => context?.onDelete && context.onDelete(data.id);

    return (
        <div className="ag-actions-cell">
            <button className="btn btn-sm btn-outline-primary me-2" onClick={handleEdit}>Edit</button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>Delete</button>
        </div>
    );
};

const AgGridTable = ({
    columnDefs = [],
    rowData = [],
    onEdit,
    onDelete,
    pagination = true,
    pageSize = 10,
    className = '',
    rowSelection = 'single',
    enableSorting = true,
    enableFilter = true,
    onGridReady,
}) => {
    const gridRef = useRef(null);
    const [gridApi, setGridApi] = useState(null);

    const defaultColDef = useMemo(() => ({
        sortable: enableSorting,
        filter: enableFilter,
        resizable: true,
        flex: 1,
    }), [enableSorting, enableFilter]);

    // append actions column if callbacks provided
    const finalColumnDefs = useMemo(() => {
        const defs = [...columnDefs];
        if (onEdit || onDelete) {
            defs.push({
                headerName: 'Actions',
                field: '__actions',
                cellRenderer: 'actionCellRenderer',
                width: 140,
                sortable: false,
                filter: false,
                suppressSizeToFit: true,
            });
        }
        return defs;
    }, [columnDefs, onEdit, onDelete]);

    const frameworkComponents = useMemo(() => ({ actionCellRenderer: ActionCellRenderer }), []);

    const onGridReadyInternal = useCallback((params) => {
        setGridApi(params.api);
        if (pagination) params.api.paginationSetPageSize(pageSize);
        if (onGridReady) onGridReady(params);
    }, [onGridReady, pagination, pageSize]);

    const goToPage = (page) => {
        if (!gridApi) return;
        gridApi.paginationGoToPage(page);
    };

    const setPageSize = (size) => {
        if (!gridApi) return;
        gridApi.paginationSetPageSize(size);
    };

    return (
        <div className={`ag-theme-alpine aggrid-table-wrapper ${className}`} style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={finalColumnDefs}
                defaultColDef={defaultColDef}
                pagination={pagination}
                paginationPageSize={pageSize}
                frameworkComponents={frameworkComponents}
                context={{ onEdit, onDelete }}
                rowSelection={rowSelection}
                onGridReady={onGridReadyInternal}
                domLayout="autoHeight"
            />
        </div>
    );
};

export default AgGridTable;
