import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const SkeletonCard = () => (
  <div className="p-6 bg-gray-200 rounded-lg shadow-lg animate-pulse h-full">
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
  </div>
);

const Protocols = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem(`protocolsData-page-${page}`);
      if (cachedData) {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/protocols/predict?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        localStorage.setItem(`protocolsData-page-${page}`, JSON.stringify(result));
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <motion.h1
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Protocol Prediction
      </motion.h1>

      {loading ? (
        <SkeletonCard />
      ) : (
        <>
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-6">
            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Tippy content="The total number of logs analyzed.">
                <h2 className="text-lg font-bold mb-4">Total Logs</h2>
              </Tippy>
              <p className="text-2xl font-semibold">{data?.total_logs}</p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Tippy content="The percentage of logs where the predicted protocol matches the actual protocol.">
                <h2 className="text-lg font-bold mb-4">Match Percentage</h2>
              </Tippy>
              <p className="text-2xl font-semibold">
                {data?.match_percentage.toFixed(2)}%
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <Tippy content="The total number of logs where the predicted protocol does not match the actual protocol.">
                <h2 className="text-lg font-bold mb-4">Mismatch Count</h2>
              </Tippy>
              <p className="text-2xl font-semibold">{data?.mismatch_count}</p>
            </motion.div>
          </div>

          {/* Logs Table */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg w-full max-w-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Tippy content="This table shows details of each log, including the length, actual protocol, predicted protocol, and whether there was a mismatch.">
              <h2 className="text-lg font-bold mb-4">Logs</h2>
            </Tippy>
            <table className="table-auto w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <Tippy content="The serial number of the log in the current page.">
                    <th className="border border-gray-200 px-4 py-2">#</th>
                  </Tippy>
                  <Tippy content="The length of the network packet in bytes.">
                    <th className="border border-gray-200 px-4 py-2">Length</th>
                  </Tippy>
                  <Tippy content="The protocol observed in the log.">
                    <th className="border border-gray-200 px-4 py-2">Actual Protocol</th>
                  </Tippy>
                  <Tippy content="The protocol predicted by the model.">
                    <th className="border border-gray-200 px-4 py-2">Predicted Protocol</th>
                  </Tippy>
                  <Tippy content="Indicates whether the predicted protocol matches the actual protocol.">
                    <th className="border border-gray-200 px-4 py-2">Mismatch</th>
                  </Tippy>
                </tr>
              </thead>
              <tbody>
                {data?.logs.map((log, index) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{log.Length}</td>
                    <td className="border border-gray-200 px-4 py-2">{log.Protocol}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {log.Predicted_Protocol}
                    </td>
                    <td
                      className={`border border-gray-200 px-4 py-2 ${
                        log.Mismatch ? "text-red-600 font-bold" : "text-green-600"
                      }`}
                    >
                      {log.Mismatch ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Pagination */}
          <div className="flex justify-between mt-4 w-full max-w-6xl">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-gray-600">Page {page}</span>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data?.logs.length < limit}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Protocols;
