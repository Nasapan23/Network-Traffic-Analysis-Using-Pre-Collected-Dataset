import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SkeletonCard = () => (
  <div className="p-6 bg-gray-200 rounded-lg shadow-lg animate-pulse h-full">
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
  </div>
);

const formatTimestamp = (value) => {
  const computedTime = moment().subtract(value / 10, "seconds");
  return computedTime.format("YYYY-MM-DD HH:mm:ss");
};

const AnomaliesPage = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);

  const fetchAnomaliesWithCache = async () => {
    const cacheKey = `anomalies-page-${page}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      setData(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/test-anomalies?page=${page}&limit=${limit}`);
      const result = await response.json();
      setData(result);
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (error) {
      console.error("Error fetching anomalies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomaliesWithCache();
  }, [page]);

  const renderHarshnessLevel = (level) => {
    const colors = {
      Critical: "text-red-600",
      High: "text-orange-600",
      Moderate: "text-yellow-600",
      Low: "text-green-600",
    };
    return (
      <Tippy content="Indicates the severity of the anomalies detected.">
        <span className={`font-bold ${colors[level]}`}>{level}</span>
      </Tippy>
    );
  };

  const chartData = {
    labels: data?.anomalies.map((_, index) => `A${index + 1}`) || [],
    datasets: [
      {
        label: "Anomaly Lengths",
        data: data?.anomalies.map((anomaly) => anomaly.Length) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Length: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Anomalies", font: { size: 14 } },
      },
      y: {
        title: { display: true, text: "Length", font: { size: 14 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <motion.h1
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Anomalies Overview
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">
                Summary
                <Tippy content="This card provides an overview of anomaly statistics.">
                  <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
                </Tippy>
              </h2>
              <p>Total Logs: {data?.total_logs}</p>
              <p>Anomalies Detected: {data?.anomaly_count}</p>
              <p>Harshness Level: {renderHarshnessLevel(data?.harshness)}</p>
            </>
          )}
        </motion.div>
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">
                Anomalies Chart
                <Tippy content="This bar chart visualizes the lengths of detected anomalies.">
                  <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
                </Tippy>
              </h2>
              <Bar data={chartData} options={chartOptions} />
            </>
          )}
        </motion.div>
      </div>
      <div className="w-full max-w-6xl mt-6">
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg h-full relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">
                Anomalies Table
                <Tippy content="This table displays detailed information about detected anomalies.">
                  <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
                </Tippy>
              </h2>
              <table className="table-auto w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">#</th>
                    <th className="border border-gray-200 px-4 py-2">Timestamp</th>
                    <th className="border border-gray-200 px-4 py-2">Source</th>
                    <th className="border border-gray-200 px-4 py-2">Destination</th>
                    <th className="border border-gray-200 px-4 py-2">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.anomalies.map((anomaly, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{formatTimestamp(anomaly.Timestamp)}</td>
                      <td className="border border-gray-200 px-4 py-2">{anomaly.Source}</td>
                      <td className="border border-gray-200 px-4 py-2">{anomaly.Destination}</td>
                      <td className="border border-gray-200 px-4 py-2">{anomaly.Length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </motion.div>
      </div>
      <div className="flex justify-between items-center w-full max-w-6xl mt-4">
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
          disabled={data?.anomalies.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AnomaliesPage;
