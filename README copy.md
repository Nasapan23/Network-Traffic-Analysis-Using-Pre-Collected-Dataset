
# Netano - AI Network Analyzer

Netano is an advanced AI-powered network analysis tool designed to detect anomalies, analyze traffic patterns, and provide insights into network behavior. It leverages machine learning models to process and analyze live or stored network logs, enabling users to gain critical insights into network activity.

---

## Features

- **Anomaly Detection**: Identifies irregularities in network traffic using AI models trained on historical data.
- **Clustering**: Groups network logs into clusters for better understanding of similar patterns or behaviors.
- **Hotspot Analysis**: Highlights the most active sources and destinations in the network.
- **Protocol Prediction**: Predicts the expected protocol for network packets and identifies mismatches.

---

## How It Works

### Backend
- **Database**: MongoDB serves as the database to store approximately 50,000 logs in the `logs` collection and an additional 50,000 training logs in the `training_logs` collection.
- **AI Models**: 
  - Models for anomaly detection, clustering, hotspot analysis, and protocol prediction are trained using MongoDB's vector capabilities.
  - Models are hosted on a FastAPI backend, which fetches logs from MongoDB and performs real-time analysis.
- **API**: The FastAPI backend exposes endpoints for each module (anomalies, clusters, hotspots, protocols), delivering processed data to the frontend.

### Frontend
- **Framework**: Built with Vite + React for a fast, responsive user interface.
- **Features**:
  - Interactive dashboards displaying analyzed results.
  - Charts and tables to visualize anomalies, clusters, hotspots, and protocol predictions.
  - Tooltips to provide contextual information for every metric and result.
  - Pagination and caching for seamless navigation and performance optimization.

---

## Dataset
The dataset consists of network logs captured using Wireshark on a Kali Linux machine. The format includes:
- **Fields**: Timestamp, Source, Destination, Protocol, Length, Info
- Example:
  ```csv
  "Time","Source","No.","Destination","Protocol","Length","Info"
  "0.000000","192.167.8.166","1","192.167.255.255","NBNS","92","Name query NB WPAD<00>"
  ```

### Training Data
- Logs from the `training_logs` collection were used to train the models.
- The AI models were optimized for anomaly detection, clustering, and protocol mismatch identification.

---

## Installation

### Prerequisites
- MongoDB
- Python 3.8+
- Node.js and npm
- Vite CLI

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/netano.git
   cd netano/backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage

1. Open the frontend in your browser (usually `http://localhost:3000`).
2. Navigate through the sections:
   - **Anomalies**: View detected anomalies and their severity.
   - **Clusters**: Explore grouped network patterns.
   - **Hotspots**: Identify the top sources, destinations, and protocols.
   - **Protocols**: Analyze protocol mismatches and predictions.

---

## Screenshots

### Dashboard Overview
![Dashboard Overview](screenshots/dashboard-overview.png)

### Anomalies
![Anomalies Overview](screenshots/anomalies-overview.png)

### Clusters
![Clusters Analysis](screenshots/clusters-analysis.png)

### Hotspots
![Hotspots Analysis](screenshots/hotspots-analysis.png)

---

## Future Enhancements
- Implement real-time log ingestion for continuous monitoring.
- Expand the dataset for more robust AI model training.
- Integrate with external alerting systems for automated responses.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Authors
- **Your Name** - Project Lead
- **Contributors** - Acknowledgements for any collaborators

---

## Acknowledgments
- Wireshark for network log generation
- MongoDB for vector database capabilities
- React and Vite for frontend development
- Python and FastAPI for backend services
