import React from "react";
import { motion } from "framer-motion";

const DataTable = ({
  columns,
  rows,
  pageSize = 10,
  checkboxSelection = false,
  onRowSelected,
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleRowSelection = (rowId) => {
    let updatedSelection = [...selectedRows];
    if (updatedSelection.includes(rowId)) {
      updatedSelection = updatedSelection.filter((id) => id !== rowId);
    } else {
      updatedSelection.push(rowId);
    }
    setSelectedRows(updatedSelection);
    if (onRowSelected) {
      onRowSelected(updatedSelection.map((id) => rows.find((row) => row.id === id)));
    }
  };

  const startIndex = currentPage * pageSize;
  const paginatedRows = rows.slice(startIndex, startIndex + pageSize);

  const pageCount = Math.ceil(rows.length / pageSize);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-800 text-white text-sm uppercase font-semibold">
        <div className="grid grid-cols-12 p-3">
          {checkboxSelection && <div className="col-span-1"></div>}
          {columns.map((col, index) => (
            <div key={index} className={`col-span-${12 / columns.length} truncate`}>
              {col.headerName}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div>
        {paginatedRows.map((row, rowIndex) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`grid grid-cols-12 items-center p-3 border-b ${
              selectedRows.includes(row.id)
                ? "bg-blue-100"
                : "hover:bg-gray-50 transition"
            }`}
          >
            {checkboxSelection && (
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowSelection(row.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
            )}
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className={`col-span-${12 / columns.length} truncate text-gray-700`}
              >
                {row[col.field]}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-3 bg-gray-100">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))}
          disabled={currentPage === pageCount - 1}
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
