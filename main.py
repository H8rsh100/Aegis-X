import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import datetime
import logging
import matplotlib.pyplot as plt
class AegisX_Core:
    def __init__(self):
        # The 'Brain' - 200 estimators for high precision
        self.brain = IsolationForest(n_estimators=200, contamination=0.02)
        self.is_trained = False
        
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

    def self_heal(self, threat_data):
        """The Response Logic - This is the 'Invention'"""
        for threat in threat_data:
            timestamp = datetime.datetime.now().strftime("%H:%M:%S")
            threat_sig = hash(tuple(threat))
            
            # Console output
            print(f"[{timestamp}] [THREAT] Entropy Deviation Detected: {threat[2]:.2f}")
            print(f"[{timestamp}] [ACTION] Initiating Node Isolation Protocol...")
            print(f"[{timestamp}] [HEAL] Virtual Firewall Rule Generated: DROP PKT FROM SRC_SIG_{threat_sig}")
            
            # Persistent Logging
            logging.warning(f"[THREAT] Entropy Deviation: {threat[2]:.2f} | Latency: {threat[0]:.2f} | Pkt Size: {threat[1]:.2f}")
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

if __name__ == "__main__":
    engine = AegisX_Core()
    engine.run_deployment()