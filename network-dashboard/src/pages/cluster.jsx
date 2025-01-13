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

const ClusterPage = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(undefined); // Ensure undefined, so `0` works.
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsPage, setDetailsPage] = useState(1);
  const detailsLimit = 10;

  // Fetch Overview Data
  useEffect(() => {
    const fetchOverview = async () => {
      setLoadingOverview(true);
      try {
        const response = await fetch("http://localhost:8000/clusters/overview");
        const data = await response.json();
        setOverviewData(data);
      } catch (error) {
        console.error("Error fetching cluster overview:", error);
      } finally {
        setLoadingOverview(false);
      }
    };

    fetchOverview();
  }, []);

  // Fetch Details Data for a Selected Cluster
  useEffect(() => {
    if (selectedCluster !== undefined) {
      const fetchDetails = async () => {
        setLoadingDetails(true);
        try {
          const response = await fetch(
            `http://localhost:8000/clusters/${selectedCluster}?page=${detailsPage}&limit=${detailsLimit}`
          );
          const data = await response.json();
          setDetailsData(data);
        } catch (error) {
          console.error("Error fetching cluster details:", error);
        } finally {
          setLoadingDetails(false);
        }
      };

      fetchDetails();
    }
  }, [selectedCluster, detailsPage]);

  // Chart Data for Overview
  const chartData = {
    labels: overviewData?.clusters.map((cluster) => `Cluster ${cluster.cluster}`) || [],
    datasets: [
      {
        label: "Average Length",
        data: overviewData?.clusters.map((cluster) => cluster.avg_length) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Avg Length: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Clusters", font: { size: 14 } },
      },
      y: {
        title: { display: true, text: "Avg Length", font: { size: 14 } },
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
        Cluster Analysis
      </motion.h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mb-6">
        {/* Summary Card */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loadingOverview ? (
            <SkeletonCard />
          ) : (
            <>
              <Tippy content="The total number of logs processed in the analysis.">
                <h2 className="text-lg font-bold mb-4">Overview Summary</h2>
              </Tippy>
              <p>Total Logs: {overviewData?.total_logs}</p>
              <Tippy content="The total number of clusters identified in the dataset.">
                <p>Total Clusters: {overviewData?.total_clusters}</p>
              </Tippy>
            </>
          )}
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loadingOverview ? (
            <SkeletonCard />
          ) : (
            <>
              <Tippy content="Displays the average length of data points within each cluster.">
                <h2 className="text-lg font-bold mb-4">Cluster Average Length</h2>
              </Tippy>
              <Bar data={chartData} options={chartOptions} />
            </>
          )}
        </motion.div>
      </div>

      {/* Cluster Table */}
      <div className="w-full max-w-6xl">
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-lg font-bold mb-4">Clusters</h2>
          {loadingOverview ? (
            <SkeletonCard />
          ) : (
            <table className="table-auto w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <Tippy content="The unique ID of the cluster.">
                    <th className="border border-gray-200 px-4 py-2">Cluster ID</th>
                  </Tippy>
                  <Tippy content="The number of data points assigned to this cluster.">
                    <th className="border border-gray-200 px-4 py-2">Size</th>
                  </Tippy>
                  <Tippy content="The average length of data points in this cluster.">
                    <th className="border border-gray-200 px-4 py-2">Avg Length</th>
                  </Tippy>
                  <th className="border border-gray-200 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {overviewData?.clusters.map((cluster) => (
                  <tr key={cluster.cluster} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{cluster.cluster}</td>
                    <td className="border border-gray-200 px-4 py-2">{cluster.size}</td>
                    <td className="border border-gray-200 px-4 py-2">{cluster.avg_length.toFixed(2)}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => setSelectedCluster(cluster.cluster)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* Details Section */}
      {selectedCluster !== undefined && (
        <div className="w-full max-w-6xl mt-6 space-y-6">
          {/* Stats Card */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-lg font-bold mb-4">Cluster {selectedCluster} Stats</h2>
            {loadingDetails ? (
              <SkeletonCard />
            ) : (
              <>
                <Tippy content="The average length of data points within this cluster.">
                  <p>Average Length: {detailsData?.stats.avg_length.toFixed(2)}</p>
                </Tippy>
                <Tippy content="The shortest data point length in this cluster.">
                  <p>Min Length: {detailsData?.stats.min_length}</p>
                </Tippy>
                <Tippy content="The longest data point length in this cluster.">
                  <p>Max Length: {detailsData?.stats.max_length}</p>
                </Tippy>
              </>
            )}
          </motion.div>

          {/* Logs Table */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-lg font-bold mb-4">Cluster {selectedCluster} Logs</h2>
            {loadingDetails ? (
              <SkeletonCard />
            ) : (
              <>
                <table className="table-auto w-full text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <Tippy content="The serial number of the log entry.">
                        <th className="border border-gray-200 px-4 py-2">#</th>
                      </Tippy>
                      <Tippy content="The length of the log entry in bytes.">
                        <th className="border border-gray-200 px-4 py-2">Length</th>
                      </Tippy>
                      <Tippy content="The source IP address of the data.">
                        <th className="border border-gray-200 px-4 py-2">Source</th>
                      </Tippy>
                      <Tippy content="The destination IP address of the data.">
                        <th className="border border-gray-200 px-4 py-2">Destination</th>
                      </Tippy>
                      <Tippy content="The protocol used in the log entry.">
                        <th className="border border-gray-200 px-4 py-2">Protocol</th>
                      </Tippy>
                      <Tippy content="Additional information about the log entry.">
                        <th className="border border-gray-200 px-4 py-2">Info</th>
                      </Tippy>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsData?.logs.map((log, index) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-200 px-4 py-2">{log.Length}</td>
                        <td className="border border-gray-200 px-4 py-2">{log.Source}</td>
                        <td className="border border-gray-200 px-4 py-2">{log.Destination}</td>
                        <td className="border border-gray-200 px-4 py-2">{log.Protocol}</td>
                        <td className="border border-gray-200 px-4 py-2">{log.Info}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                    onClick={() => setDetailsPage((prev) => Math.max(prev - 1, 1))}
                    disabled={detailsPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">Page {detailsPage}</span>
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                    onClick={() => setDetailsPage((prev) => prev + 1)}
                    disabled={detailsData?.logs.length < detailsLimit}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClusterPage;

