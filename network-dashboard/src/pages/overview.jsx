import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const SkeletonCard = () => (
  <div className="p-6 bg-gray-200 rounded-lg shadow-lg animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
  </div>
);

const Overview = () => {
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [clustersData, setClustersData] = useState(null);
  const [hotspotsData, setHotspotsData] = useState(null);
  const [protocolsData, setProtocolsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataWithCache = async (endpoint, localStorageKey, setState, signal) => {
    const cachedData = localStorage.getItem(localStorageKey);
    if (cachedData) {
      setState(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint, { signal });
      const data = await response.json();
      setState(data);
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    fetchDataWithCache("http://localhost:8000/test-anomalies", "anomaliesData", setAnomaliesData, signal);
    fetchDataWithCache("http://localhost:8000/clusters/overview", "clustersData", setClustersData, signal);
    fetchDataWithCache("http://localhost:8000/hotspots", "hotspotsData", setHotspotsData, signal);
    fetchDataWithCache("http://localhost:8000/protocols/predict", "protocolsData", setProtocolsData, signal);

    return () => controller.abort();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Dashboard Overview</h1>
        <p className="text-gray-700 text-left max-w-4xl mx-auto">
          This application provides insights into network traffic data captured on a Kali machine.
          The dataset includes logs of network activities, which are analyzed using advanced AI
          models for anomaly detection, clustering, hotspot analysis, and protocol prediction.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            Anomalies
            <Tippy content="Anomalies represent unusual patterns in network traffic that may indicate security issues or abnormal behavior.">
              <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
            </Tippy>
          </h2>
          {anomaliesData ? (
            <div>
              <p>Total Logs: {anomaliesData.total_logs}</p>
              <p>Anomalies Detected: {anomaliesData.anomaly_count}</p>
              <p>Harshness: {anomaliesData.harshness}</p>
            </div>
          ) : (
            <SkeletonCard />
          )}
        </motion.div>

        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            Clusters
            <Tippy content="Clusters group similar network activities based on shared characteristics, helping to identify patterns or trends.">
              <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
            </Tippy>
          </h2>
          {clustersData ? (
            <div>
              <p>Total Clusters: {clustersData.total_clusters}</p>
              <ul className="mt-2">
                {clustersData.clusters.map((cluster, index) => (
                  <li key={index}>
                    Cluster {cluster.cluster}: {cluster.size} logs (Avg Length:{" "}
                    {Math.round(cluster.avg_length)})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <SkeletonCard />
          )}
        </motion.div>

        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            Hotspots
            <Tippy content="Hotspots are the most active IP addresses (both source and destination), highlighting key areas of network activity.">
              <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
            </Tippy>
          </h2>
          {hotspotsData ? (
            <div>
              <p>Total Logs: {hotspotsData.total_logs}</p>
              <h3 className="font-semibold">Top Destinations:</h3>
              <ul>
                {hotspotsData.top_destinations.map((dest, index) => (
                  <li key={index}>
                    {dest.Destination}: {dest.Count} (
                    {Math.round(dest.Percentage)}%)
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <SkeletonCard />
          )}
        </motion.div>

        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            Protocols
            <Tippy content="Protocol predictions assess whether the detected network protocols match expected patterns, identifying mismatches.">
              <span className="ml-2 text-blue-500 cursor-pointer">ⓘ</span>
            </Tippy>
          </h2>
          {protocolsData ? (
            <div>
              <p>Total Logs: {protocolsData.total_logs}</p>
              <p>Match Percentage: {Math.round(protocolsData.match_percentage)}%</p>
            </div>
          ) : (
            <SkeletonCard />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
