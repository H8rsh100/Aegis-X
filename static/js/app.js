/**
 * Aegis-X — Dashboard Controller
 * Handles API fetching, 3D visualization, threat feed rendering, and health polling.
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM References
    const refreshBtn   = document.getElementById('refresh-btn');
    const threatFeed   = document.getElementById('threat-feed');
    const feedEmpty    = document.getElementById('feed-empty');
    const feedCountEl  = document.getElementById('feed-count');
    const totalNodesEl = document.getElementById('total-nodes');
    const threatCountEl= document.getElementById('threat-count');
    const scanCountEl  = document.getElementById('scan-count');
    const uptimeEl     = document.getElementById('system-uptime');
    const sevCriticalEl= document.getElementById('sev-critical');
    const sevHighEl    = document.getElementById('sev-high');
    const sevMediumEl  = document.getElementById('sev-medium');
    const loadingState = document.getElementById('loading-state');

    let isFirstLoad = true;

    // --- Plotly Layout (dark, transparent, clean) ---
    const plotLayout = {
        scene: {
            xaxis: {
                title: { text: 'Latency (ms)', font: { size: 10, color: '#7a8ba8' } },
                color: '#7a8ba8', gridcolor: 'rgba(255,255,255,0.04)',
                zerolinecolor: 'rgba(255,255,255,0.06)'
            },
            yaxis: {
                title: { text: 'Packet Size', font: { size: 10, color: '#7a8ba8' } },
                color: '#7a8ba8', gridcolor: 'rgba(255,255,255,0.04)',
                zerolinecolor: 'rgba(255,255,255,0.06)'
            },
            zaxis: {
                title: { text: 'Entropy', font: { size: 10, color: '#7a8ba8' } },
                color: '#7a8ba8', gridcolor: 'rgba(255,255,255,0.04)',
                zerolinecolor: 'rgba(255,255,255,0.06)'
            },
            bgcolor: 'rgba(0,0,0,0)',
            aspectmode: 'cube',
            camera: {
                eye: { x: 1.6, y: 1.6, z: 0.9 },
                center: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 0, z: 1 }
            }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { l: 0, r: 0, b: 0, t: 0 },
        showlegend: true,
        legend: {
            font: { color: '#7a8ba8', size: 10 },
            bgcolor: 'rgba(0,0,0,0.3)',
            bordercolor: 'rgba(255,255,255,0.06)',
            borderwidth: 1,
            x: 0.01, y: 0.99
        }
    };

    const plotConfig = { responsive: true, displayModeBar: false };

    // --- Fetch Scan Data ---
    const fetchScanData = async () => {
        try {
            refreshBtn.disabled = true;
            refreshBtn.classList.add('scanning');
            refreshBtn.querySelector('span').textContent = 'SCANNING…';

            const response = await fetch('/api/data');
            const data = await response.json();
            updateDashboard(data);
        } catch (error) {
            console.error('Scan error:', error);
            if (feedEmpty) {
                feedEmpty.querySelector('span').textContent = 'Connection to backend failed.';
            }
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('scanning');
            refreshBtn.querySelector('span').textContent = 'SCAN MESH';
        }
    };

    // --- Update All Dashboard Sections ---
    const updateDashboard = (data) => {
        const { traffic, predictions, threats, severity_counts } = data;

        // Split data for plot
        const normalX = [], normalY = [], normalZ = [];
        const threatX = [], threatY = [], threatZ = [];

        traffic.forEach((pt, i) => {
            if (predictions[i] === 1) {
                normalX.push(pt[0]); normalY.push(pt[1]); normalZ.push(pt[2]);
            } else {
                threatX.push(pt[0]); threatY.push(pt[1]); threatZ.push(pt[2]);
            }
        });

        // Plotly traces
        const traceNormal = {
            x: normalX, y: normalY, z: normalZ,
            mode: 'markers',
            marker: { size: 2.5, color: '#00e5ff', opacity: 0.45 },
            type: 'scatter3d',
            name: 'Normal Traffic'
        };

        const traceThreat = {
            x: threatX, y: threatY, z: threatZ,
            mode: 'markers',
            marker: {
                size: 6, color: '#ff2d55', symbol: 'cross',
                line: { width: 1, color: 'rgba(255,45,85,0.6)' }
            },
            type: 'scatter3d',
            name: 'Zero-Day Threat'
        };

        // Render plot
        if (isFirstLoad) {
            if (loadingState) loadingState.style.display = 'none';
            Plotly.newPlot('mesh-plot', [traceNormal, traceThreat], plotLayout, plotConfig);
            isFirstLoad = false;
        } else {
            Plotly.react('mesh-plot', [traceNormal, traceThreat], plotLayout);
        }

        // KPI stats (animate numbers)
        animateValue(totalNodesEl, traffic.length);
        animateValue(threatCountEl, threats.length);

        // Severity counts
        if (severity_counts) {
            sevCriticalEl.textContent = severity_counts.CRITICAL || 0;
            sevHighEl.textContent     = severity_counts.HIGH || 0;
            sevMediumEl.textContent   = severity_counts.MEDIUM || 0;
        }

        // Feed
        updateThreatFeed(threats);
    };

    // --- Animate Number Counting ---
    const animateValue = (el, target) => {
        const current = parseInt(el.textContent) || 0;
        if (current === target) { el.textContent = target; return; }
        const duration = 400;
        const steps = 20;
        const increment = (target - current) / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            el.textContent = Math.round(current + increment * step);
            if (step >= steps) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, duration / steps);
    };

    // --- Render Threat Feed ---
    const updateThreatFeed = (threats) => {
        // Hide empty state
        if (feedEmpty) feedEmpty.style.display = threats.length > 0 ? 'none' : 'flex';

        // Clear previous items (not the empty placeholder)
        const existingItems = threatFeed.querySelectorAll('.threat-item');
        existingItems.forEach(item => item.remove());

        // Update count badge
        feedCountEl.textContent = `${threats.length} event${threats.length !== 1 ? 's' : ''}`;

        // Severity class map
        const sevClass = { 'CRITICAL': 'critical', 'HIGH': 'high', 'MEDIUM': 'medium' };

        threats.forEach((threat, i) => {
            const el = document.createElement('div');
            el.className = `threat-item sev-${(threat.severity || 'medium').toLowerCase()}`;
            el.style.animationDelay = `${i * 0.04}s`;

            const sev = threat.severity || 'MEDIUM';
            const sevCls = sevClass[sev] || 'medium';

            el.innerHTML = `
                <div class="threat-item__header">
                    <span class="threat-item__time">${threat.timestamp}</span>
                    <span class="severity-tag ${sevCls}">${sev}</span>
                </div>
                <div class="threat-item__title">Node Isolation Protocol Activated</div>
                <div class="threat-item__metrics">
                    ENT: ${threat.entropy.toFixed(2)} &nbsp;│&nbsp; LAT: ${threat.latency.toFixed(2)}ms &nbsp;│&nbsp; PKT: ${threat.packet_size.toFixed(2)}B
                </div>
                <div class="threat-item__rule">> ${threat.action} FROM ${threat.signature}</div>
            `;
            threatFeed.appendChild(el);
        });
    };

    // --- Fetch System Health ---
    const fetchHealth = async () => {
        try {
            const res = await fetch('/api/health');
            const health = await res.json();
            if (uptimeEl) uptimeEl.textContent = health.uptime;
            if (scanCountEl) animateValue(scanCountEl, health.total_scans);
        } catch (e) {
            console.error('Health fetch error:', e);
        }
    };

    // --- Init ---
    fetchScanData();
    fetchHealth();

    refreshBtn.addEventListener('click', () => {
        fetchScanData();
        setTimeout(fetchHealth, 300);
    });

    // Auto-refresh every 12 seconds
    setInterval(() => {
        fetchScanData();
        fetchHealth();
    }, 12000);
});
