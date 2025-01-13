import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
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

const Hotspots = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem("hotspotsData");
      if (cachedData) {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/hotspots", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        localStorage.setItem("hotspotsData", JSON.stringify(result));
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Bar Chart Data
  const topDestinationsChartData = {
    labels: data?.top_destinations.map((item) => item.Destination) || [],
    datasets: [
      {
        label: "Count",
        data: data?.top_destinations.map((item) => item.Count) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const topSourcesChartData = {
    labels: data?.top_sources.map((item) => item.Source) || [],
    datasets: [
      {
        label: "Count",
        data: data?.top_sources.map((item) => item.Count) || [],
        backgroundColor: "rgba(192, 75, 75, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Entities", font: { size: 14 } },
      },
      y: {
        title: { display: true, text: "Count", font: { size: 14 } },
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
        Hotspots Analysis
      </motion.h1>

      {loading ? (
        <SkeletonCard />
      ) : (
        <>
          {/* Summary Cards */}
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
              <Tippy content="The most frequent destination IP in the dataset.">
                <h2 className="text-lg font-bold mb-4">Top Destination</h2>
              </Tippy>
              <p className="text-2xl font-semibold">{data?.top_destinations[0]?.Destination}</p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <Tippy content="The most used protocol in the dataset.">
                <h2 className="text-lg font-bold mb-4">Top Protocol</h2>
              </Tippy>
              <p className="text-2xl font-semibold">{data?.top_protocols[0]?.Protocol}</p>
            </motion.div>
          </div>

          {/* Bar Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Tippy content="A chart showing the most frequent destinations.">
                <h2 className="text-lg font-bold mb-4">Top Destinations</h2>
              </Tippy>
              <Bar data={topDestinationsChartData} options={chartOptions} />
            </motion.div>

            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <Tippy content="A chart showing the most frequent sources.">
                <h2 className="text-lg font-bold mb-4">Top Sources</h2>
              </Tippy>
              <Bar data={topSourcesChartData} options={chartOptions} />
            </motion.div>
          </div>

          {/* Table for Protocols */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg w-full max-w-6xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Tippy content="A table displaying the most used protocols along with their counts and percentages.">
              <h2 className="text-lg font-bold mb-4">Top Protocols</h2>
            </Tippy>
            <table className="table-auto w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <Tippy content="The protocol name.">
                    <th className="border border-gray-200 px-4 py-2">Protocol</th>
                  </Tippy>
                  <Tippy content="The number of times this protocol was used.">
                    <th className="border border-gray-200 px-4 py-2">Count</th>
                  </Tippy>
                  <Tippy content="The percentage usage of this protocol.">
                    <th className="border border-gray-200 px-4 py-2">Percentage (%)</th>
                  </Tippy>
                </tr>
              </thead>
              <tbody>
                {data?.top_protocols.map((protocol, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{protocol.Protocol}</td>
                    <td className="border border-gray-200 px-4 py-2">{protocol.Count}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {protocol.Percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Hotspots;
