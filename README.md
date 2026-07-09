# ⬡ Aegis-X: Autonomous Neural Mesh Threat Detection

<p align="center">
  <strong>AI-Powered Zero-Day Attack Detection for IoT Mesh Networks</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/ML-Isolation%20Forest-orange?style=for-the-badge&logo=scikit-learn" alt="ML">
  <img src="https://img.shields.io/badge/Framework-Flask-lightgrey?style=for-the-badge&logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/Viz-Plotly%203D-blueviolet?style=for-the-badge&logo=plotly" alt="Plotly">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

---

## 🧠 What is Aegis-X?

**Aegis-X** is an autonomous cybersecurity engine designed to detect zero-day attacks in encrypted IoT mesh networks using unsupervised machine learning. It analyzes traffic patterns across three critical dimensions - **latency**, **packet size**, and **entropy** - to identify anomalous behavior indicative of data exfiltration, DDoS attacks, or protocol-level exploits.

When a threat is detected, Aegis-X automatically initiates **Node Isolation Protocols** and generates virtual firewall rules - simulating a self-healing network defense system.

## ✨ Key Features

| Feature | Description |
|---|---|
| **Isolation Forest ML Engine** | 200-estimator unsupervised anomaly detection model with 2% contamination tuning |
| **Zero-Day Attack Simulation** | Generates realistic mesh traffic with embedded attack vectors (jittery latency, entropy collapse, oversized packets) |
| **Self-Healing Response** | Automatic virtual firewall rule generation and node isolation on threat detection |
| **3D Traffic Visualization** | Interactive Plotly.js scatter plot showing normal vs. threat traffic in feature space |
| **Real-Time Dashboard** | Flask-powered web UI with live threat feed, stats cards, and auto-refresh (10s intervals) |
| **Threat Severity Classification** | Threats are classified as CRITICAL, HIGH, or MEDIUM based on entropy deviation |
| **Persistent Logging** | All threats and healing actions logged to `aegis_threats.log` |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Aegis-X Core Engine             │
│                  (main.py)                   │
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Traffic      │  │ Isolation Forest     │  │
│  │ Simulator    │──│ Anomaly Detector     │  │
│  │ (IoT Mesh)   │  │ (200 estimators)     │  │
│  └──────────────┘  └──────────────────────┘  │
│         │                    │                │
│         ▼                    ▼                │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Self-Healing │  │ Threat Severity      │  │
│  │ Engine       │  │ Classifier           │  │
│  └──────────────┘  └──────────────────────┘  │
└──────────────────────┬──────────────────────┘
                       │ REST API
                       ▼
 ┌─────────────────────────────────────────────┐
│           Flask Web Server (app.py)          │
│                                              │
│  GET /           → Dashboard UI              │
│  GET /api/data   → Threat + Traffic JSON     │
│  GET /api/health → System Health Status      │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
 ┌─────────────────────────────────────────────┐
│        Interactive Web Dashboard             │
│                                              │
│  • 3D Plotly Traffic Topology               │
│  • Real-Time Threat Feed                    │
│  • Node Stats & Severity Indicators         │
│  • Auto-Refresh (10s polling)               │
└─────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/H8rsh100/Aegis-X.git
cd Aegis-X

# Install dependencies
pip install -r requirements.txt
```

### Run the Dashboard

```bash
python app.py
```

Then open your browser to **http://localhost:5050**

### Run CLI Mode (No UI)

```bash
python main.py
```

This runs the detection engine directly in terminal and outputs a `traffic_analysis.png` matplotlib visualization.

## 📁 Project Structure

```
Aegis-X/
├── main.py              # Core ML engine: Isolation Forest, traffic simulation, self-healing
├── app.py               # Flask web server with REST API endpoints
├── requirements.txt     # Python dependencies
├── templates/
│   └── index.html       # Dashboard HTML template (Jinja2)
├── static/
│   ├── css/
│   │   └── style.css    # Cyberpunk dark theme stylesheet
│   └── js/
│       └── app.js       # Frontend logic: Plotly 3D rendering, live threat feed
└── README.md
```

## 🛡️ How It Works

1. **Traffic Generation**: Simulates 500 normal IoT mesh packets + 10 zero-day attack vectors with anomalous entropy, latency, and packet sizes.
2. **Anomaly Detection**: An Isolation Forest model (n_estimators=200, contamination=0.02) scores each data point. Outliers (score = -1) are flagged as threats.
3. **Threat Classification**: Each detected threat is assigned a severity level (CRITICAL / HIGH / MEDIUM) based on entropy deviation from baseline.
4. **Self-Healing**: For each threat, a virtual firewall rule is auto-generated: `DROP PKT FROM SRC_SIG_<hash>`, and the node is isolated.
5. **Visualization**: Results are displayed as an interactive 3D scatter plot, with normal traffic in cyan and threats as red crosses.

## 🔧 Tech Stack

- **Machine Learning**: scikit-learn (Isolation Forest)
- **Data Processing**: NumPy, Pandas
- **Visualization**: Plotly.js (browser), Matplotlib (CLI)
- **Backend**: Flask (Python)
- **Frontend**: Vanilla JS, CSS3 with glassmorphism effects

---

## License

MIT - see LICENSE.
