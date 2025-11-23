import React from "react";
import { Table } from "react-bootstrap";

const DynamicTable = ({ data = [], renderCell = {} }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-3 text-muted">
                No records found.
            </div>
        );
    }

    const columns = Object.keys(data[0]); // auto-detect columns

    return (
        <Table responsive hover>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col}>{col.replace(/_/g, " ").toUpperCase()}</th>
                    ))}

                    {/* Optional custom actions column */}
                    {renderCell["actions"] && <th>ACTIONS</th>}
                </tr>
            </thead>

            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        {columns.map((col) => (
                            <td key={col}>
                                {renderCell[col]
                                    ? renderCell[col](row[col], row)
                                    : row[col]}
                            </td>
                        ))}

                        {/* custom action buttons */}
                        {renderCell["actions"] && (
                            <td>{renderCell["actions"](row)}</td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default DynamicTable;
