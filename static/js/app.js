document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const threatFeed = document.getElementById('threat-feed');
    const totalNodesEl = document.getElementById('total-nodes');
    const threatCountEl = document.getElementById('threat-count');
    
    let isFirstLoad = true;

    // Plotly layout configuration for Dark Mode
    const layout = {
        scene: {
            xaxis: { title: 'Latency (ms)', color: '#94a3b8', gridcolor: '#1e293b' },
            yaxis: { title: 'Packet Size', color: '#94a3b8', gridcolor: '#1e293b' },
            zaxis: { title: 'Entropy', color: '#94a3b8', gridcolor: '#1e293b' },
            bgcolor: 'rgba(0,0,0,0)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { l: 0, r: 0, b: 0, t: 0 },
        showlegend: true,
        legend: { font: { color: '#e2e8f0' } }
    };

    const fetchScanData = async () => {
        try {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<span class="pulse" style="display:inline-block; margin-right:8px;"></span> Scanning...';
            
            const response = await fetch('/api/data');
            const data = await response.json();
            
            updateDashboard(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            threatFeed.innerHTML = `<div class="threat-item" style="border-left-color: #ffcc00;"><div class="threat-title">System Error</div><div class="threat-details">Failed to connect to Neural Mesh backend.</div></div>`;
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = 'Scan Mesh Now';
        }
    };

    const updateDashboard = (data) => {
        const traffic = data.traffic;
        const predictions = data.predictions;
        const threats = data.threats;
        
        // Split data for Plotly
        const normalX = [], normalY = [], normalZ = [];
        const threatX = [], threatY = [], threatZ = [];
        
        traffic.forEach((pt, i) => {
            if (predictions[i] === 1) {
                normalX.push(pt[0]);
                normalY.push(pt[1]);
                normalZ.push(pt[2]);
            } else {
                threatX.push(pt[0]);
                threatY.push(pt[1]);
                threatZ.push(pt[2]);
            }
        });

        // Create Plotly Traces
        const traceNormal = {
            x: normalX, y: normalY, z: normalZ,
            mode: 'markers',
            marker: { size: 4, color: '#00d2ff', opacity: 0.5 },
            type: 'scatter3d',
            name: 'Normal Traffic'
        };

        const traceThreat = {
            x: threatX, y: threatY, z: threatZ,
            mode: 'markers',
            marker: { size: 8, color: '#ff3366', symbol: 'cross' },
            type: 'scatter3d',
            name: 'Zero-Day Threat'
        };

        if (isFirstLoad) {
            document.getElementById('mesh-plot').innerHTML = ''; // Remove loading text
            Plotly.newPlot('mesh-plot', [traceNormal, traceThreat], layout, {responsive: true, displayModeBar: false});
            isFirstLoad = false;
        } else {
            Plotly.react('mesh-plot', [traceNormal, traceThreat], layout);
        }

        // Update Stats
        totalNodesEl.innerText = traffic.length;
        threatCountEl.innerText = threats.length;

        // Update Feed
        updateThreatFeed(threats);
    };

    const updateThreatFeed = (threats) => {
        // Prepend new threats
        threats.forEach(threat => {
            const el = document.createElement('div');
            el.className = 'threat-item';
            el.innerHTML = `
                <div class="threat-meta">
                    <span>${threat.timestamp}</span>
                    <span>ENTROPY_DEV: ${threat.entropy.toFixed(2)}</span>
                </div>
                <div class="threat-title">Node Isolation Protocol Activated</div>
                <div class="threat-details">
                    LAT: ${threat.latency.toFixed(2)}ms | PKT: ${threat.packet_size.toFixed(2)}B
                </div>
                <div class="firewall-rule">
                    > ${threat.action} FROM ${threat.signature}
                </div>
            `;
            threatFeed.insertBefore(el, threatFeed.firstChild);
        });

        // Limit feed items
        while (threatFeed.children.length > 50) {
            threatFeed.removeChild(threatFeed.lastChild);
        }
    };

    // Initial Load
    fetchScanData();

    // Event Listeners
    refreshBtn.addEventListener('click', fetchScanData);
    
    // Auto refresh every 10 seconds to simulate live feed
    setInterval(fetchScanData, 10000);
});
