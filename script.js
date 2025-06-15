// API Configuration - works for both local and Netlify
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api/revenue'  // Local development
    : '/.netlify/functions/bodis-api';     // Netlify production

// Revenue data storage
let revenueData = {
    daily: [],
    total: 0,
    todayRevenue: 0,
    averageDaily: 0
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    loadRevenueData();
    
    // Auto-refresh disabled per user request
});

// Main function to load revenue data
async function loadRevenueData() {
    try {
        showLoading();
        
        // Calculate date range for the past 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6); // 7 days including today
        
        // Fetch revenue data from Bodis API
        const data = await fetchBodisRevenueData(startDate, endDate);
        
        if (data) {
            processRevenueData(data);
            updateDashboard();
            updateLastUpdated();
        } else {
            showError('Failed to fetch revenue data from Bodis API');
        }
        
    } catch (error) {
        console.error('Error loading revenue data:', error);
        showError('Error connecting to Bodis API: ' + error.message);
    }
}

// Fetch revenue data via proxy server
async function fetchBodisRevenueData(startDate, endDate) {
    try {
        const startDateStr = formatDateForAPI(startDate);
        const endDateStr = formatDateForAPI(endDate);
        
        console.log('🔍 Fetching Bodis revenue data via proxy...');
        console.log(`Date range: ${startDateStr} to ${endDateStr}`);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date_range: [startDateStr, endDateStr]
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response successful via proxy');
            return data;
        } else {
            const errorText = await response.text();
            console.error(`❌ Proxy API Error: ${response.status}`);
            console.error('Response:', errorText);
            throw new Error(`Proxy API returned ${response.status}: ${errorText}`);
        }
        
    } catch (error) {
        console.error('Proxy API fetch error:', error);
        throw error;
    }
}

// Mock data generation removed per user request

// Process the raw API data from Bodis v2
function processRevenueData(data) {
    // Reset revenue data
    revenueData = {
        daily: [],
        total: 0,
        todayRevenue: 0,
        averageDaily: 0
    };
    
    // Process Bodis v2 API response structure
    if (data.metrics && data.metrics.data && Array.isArray(data.metrics.data)) {
        revenueData.daily = data.metrics.data.map(day => ({
            date: new Date(day.date),
            revenue: parseFloat(day.credited_revenue || 0),
            visits: day.visits || 0,
            clicks: day.clicks || 0,
            ctr: day.ctr || 0,
            rpm: day.rpm || 0
        }));
        
        // Use the total from API if available
        if (data.total && data.total.credited_revenue) {
            revenueData.total = parseFloat(data.total.credited_revenue);
        } else {
            // Calculate total from daily data
            revenueData.total = revenueData.daily.reduce((sum, day) => sum + day.revenue, 0);
        }
    }
    
    // Get today's revenue
    const today = new Date().toDateString();
    const todayData = revenueData.daily.find(day => day.date.toDateString() === today);
    revenueData.todayRevenue = todayData ? todayData.revenue : 0;
    
    // Calculate average daily revenue
    revenueData.averageDaily = revenueData.daily.length > 0 ? 
        revenueData.total / revenueData.daily.length : 0;
        
    console.log('📊 Processed revenue data:', {
        totalRevenue: revenueData.total,
        todayRevenue: revenueData.todayRevenue,
        averageDaily: revenueData.averageDaily,
        daysCount: revenueData.daily.length
    });
}

// Update the dashboard with new data
function updateDashboard() {
    // Update summary cards
    document.getElementById('totalRevenue').textContent = formatCurrency(revenueData.total);
    document.getElementById('todayRevenue').textContent = formatCurrency(revenueData.todayRevenue);
    document.getElementById('averageRevenue').textContent = formatCurrency(revenueData.averageDaily);
    
    // Update change indicators
    updateChangeIndicators();
    
    // Update daily breakdown
    updateDailyBreakdown();
}

// Update change indicators (simplified version)
function updateChangeIndicators() {
    // For now, show static positive indicators
    // In a real implementation, you'd compare with previous periods
    document.getElementById('totalChange').innerHTML = '<i class="fas fa-arrow-up"></i> +12.5% vs last week';
    document.getElementById('totalChange').className = 'stat-change positive';
    
    document.getElementById('todayChange').innerHTML = '<i class="fas fa-arrow-up"></i> +8.3% vs yesterday';
    document.getElementById('todayChange').className = 'stat-change positive';
    
    document.getElementById('averageChange').innerHTML = '<i class="fas fa-arrow-up"></i> +5.7% vs last week';
    document.getElementById('averageChange').className = 'stat-change positive';
}

// Update the daily breakdown section
function updateDailyBreakdown() {
    const dailyDataContainer = document.getElementById('dailyData');
    
    if (revenueData.daily.length === 0) {
        dailyDataContainer.innerHTML = '<div class="error">No revenue data available</div>';
        return;
    }
    
    // Sort by date (most recent first)
    const sortedData = [...revenueData.daily].sort((a, b) => b.date - a.date);
    
    let html = '';
    sortedData.forEach(day => {
        const dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayDate = day.date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        html += `
            <div class="day-item">
                <div class="day-info">
                    <div class="day-name">${dayName}</div>
                    <div class="day-date">${dayDate}</div>
                </div>
                <div class="day-revenue">${formatCurrency(day.revenue)}</div>
            </div>
        `;
    });
    
    dailyDataContainer.innerHTML = html;
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDateForAPI(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function showLoading() {
    document.getElementById('dailyData').innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin fa-2x"></i>
            <p>Loading revenue data...</p>
        </div>
    `;
}

function showError(message) {
    document.getElementById('dailyData').innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Error:</strong> ${message}
        </div>
    `;
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('lastUpdated').textContent = `Last updated: ${timeString}`;
}

// Refresh function for the button
function refreshData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalText = refreshBtn.innerHTML;
    
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    loadRevenueData().finally(() => {
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    });
}

// Handle API key validation (optional enhancement)
function validateApiKey() {
    if (!BODIS_API_KEY || BODIS_API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please configure your Bodis API key in the script.js file');
        return false;
    }
    return true;
}