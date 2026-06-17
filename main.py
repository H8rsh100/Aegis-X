import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import datetime
import logging
import matplotlib.pyplot as plt
import time


class AegisX_Core:
    # Entropy thresholds for severity classification
    SEVERITY_THRESHOLDS = {
        'CRITICAL': 2.0,   # Entropy below 2.0 = severe collapse (likely exfiltration)
        'HIGH': 3.0,       # Entropy below 3.0 = significant deviation
        'MEDIUM': 4.0      # Entropy below 4.0 = moderate anomaly
    }

    def __init__(self):
        # The 'Brain' - 200 estimators for high precision
        self.brain = IsolationForest(n_estimators=200, contamination=0.02)
        self.is_trained = False
        self.total_scans = 0
        self.total_threats_detected = 0
        self.start_time = time.time()
        
        # Setup logging
        logging.basicConfig(
            filename='aegis_threats.log',
            level=logging.INFO,
            format='%(asctime)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )

    def simulate_mesh_traffic(self):
        """Generates Encrypted IoT Mesh Traffic Patterns"""
        # Normal traffic: Low latency, consistent packet size, stable entropy
        normal = np.random.normal(loc=[12.0, 512, 7.5], scale=[1.5, 20, 0.1], size=(500, 3))
        # Zero-Day Attack: Jittery latency, massive packets (Exfiltration), Entropy collapse
        attacks = np.random.uniform(low=[50, 1024, 1.0], high=[200, 4096, 4.0], size=(10, 3))
        return np.vstack([normal, attacks])

    def classify_severity(self, entropy_value):
        """Classifies threat severity based on entropy deviation.
        
        Lower entropy = more severe (indicates data patterns / exfiltration).
        Normal traffic entropy is ~7.5 (high randomness = encrypted).
        """
        if entropy_value < self.SEVERITY_THRESHOLDS['CRITICAL']:
            return 'CRITICAL'
        elif entropy_value < self.SEVERITY_THRESHOLDS['HIGH']:
            return 'HIGH'
        else:
            return 'MEDIUM'

    def self_heal(self, threat_data):
        """The Response Logic - This is the 'Invention'"""
        for threat in threat_data:
            timestamp = datetime.datetime.now().strftime("%H:%M:%S")
            threat_sig = hash(tuple(threat))
            severity = self.classify_severity(threat[2])
            
            # Console output
            print(f"[{timestamp}] [{severity}] Entropy Deviation Detected: {threat[2]:.2f}")
            print(f"[{timestamp}] [ACTION] Initiating Node Isolation Protocol...")
            print(f"[{timestamp}] [HEAL] Virtual Firewall Rule Generated: DROP PKT FROM SRC_SIG_{threat_sig}")
            
            # Persistent Logging
            logging.warning(f"[{severity}] Entropy Deviation: {threat[2]:.2f} | Latency: {threat[0]:.2f} | Pkt Size: {threat[1]:.2f}")
            logging.info(f"[HEAL] Generated Virtual Firewall Rule: DROP PKT FROM SRC_SIG_{threat_sig}")
    def visualize_traffic(self, data, predictions):
        """Generates a 3D scatter plot of the traffic anomalies"""
        fig = plt.figure(figsize=(10, 7))
        ax = fig.add_subplot(111, projection='3d')
        
        # Normal traffic
        normal_data = data[predictions == 1]
        ax.scatter(normal_data[:, 0], normal_data[:, 1], normal_data[:, 2], c='blue', label='Normal Traffic', alpha=0.5)
        
        # Threat traffic
        threat_data = data[predictions == -1]
        ax.scatter(threat_data[:, 0], threat_data[:, 1], threat_data[:, 2], c='red', label='Threat (Zero-Day)', s=100, marker='X')
        
        ax.set_xlabel('Latency (ms)')
        ax.set_ylabel('Packet Size (Bytes)')
        ax.set_zlabel('Entropy')
        ax.set_title('Aegis-X: Mesh Traffic Anomaly Detection')
        ax.legend()
        
        plt.savefig('traffic_analysis.png')
        print("[VISUALIZATION] Traffic analysis plot saved as 'traffic_analysis.png'")

    def run_deployment(self):
        data = self.simulate_mesh_traffic()
        print("--- Aegis-X: Autonomous Neural Mesh Online ---")
        self.brain.fit(data)
        predictions = self.brain.predict(data)
        
        threats = data[predictions == -1]
        if len(threats) > 0:
            self.self_heal(threats)
            
        self.visualize_traffic(data, predictions)
        return len(threats)

    def get_api_data(self):
        """Returns JSON-serializable dictionary for the web dashboard."""
        data = self.simulate_mesh_traffic()
        self.brain.fit(data)
        predictions = self.brain.predict(data)
        self.total_scans += 1
        
        threat_logs = []
        severity_counts = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0}
        threats = data[predictions == -1]
        self.total_threats_detected += len(threats)

        for threat in threats:
            timestamp = datetime.datetime.now().strftime("%H:%M:%S")
            threat_sig = hash(tuple(threat))
            severity = self.classify_severity(threat[2])
            severity_counts[severity] += 1
            threat_logs.append({
                "timestamp": timestamp,
                "entropy": round(float(threat[2]), 2),
                "latency": round(float(threat[0]), 2),
                "packet_size": round(float(threat[1]), 2),
                "signature": str(threat_sig),
                "action": "DROP PKT",
                "severity": severity
            })
            # Keep persistent logging
            logging.warning(f"[{severity}] Entropy Deviation: {threat[2]:.2f} | Latency: {threat[0]:.2f} | Pkt Size: {threat[1]:.2f}")
            logging.info(f"[HEAL] Generated Virtual Firewall Rule: DROP PKT FROM SRC_SIG_{threat_sig}")
            
        return {
            "traffic": data.tolist(),
            "predictions": predictions.tolist(),
            "threats": threat_logs,
            "severity_counts": severity_counts
        }

    def get_system_health(self):
        """Returns system health metrics."""
        uptime_seconds = int(time.time() - self.start_time)
        hours, remainder = divmod(uptime_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return {
            "status": "operational",
            "uptime": f"{hours:02d}:{minutes:02d}:{seconds:02d}",
            "uptime_seconds": uptime_seconds,
            "total_scans": self.total_scans,
            "total_threats_detected": self.total_threats_detected,
            "model": {
                "algorithm": "IsolationForest",
                "n_estimators": 200,
                "contamination": 0.02
            },
            "severity_thresholds": self.SEVERITY_THRESHOLDS
        }


if __name__ == "__main__":
    engine = AegisX_Core()
    engine.run_deployment()