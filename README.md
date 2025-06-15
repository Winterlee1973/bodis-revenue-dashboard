# Bodis Revenue Dashboard

A beautiful, responsive web dashboard that displays your Bodis domain parking revenue for the past 7 days, including real-time tracking of today's earnings.

## Features

- **7-Day Revenue Overview**: View total revenue for the past week
- **Today's Revenue**: Real-time tracking of current day earnings
- **Daily Average**: Calculate average daily revenue
- **Daily Breakdown**: Detailed day-by-day revenue breakdown
- **Auto-refresh**: Updates every 5 minutes automatically
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations

## Setup Instructions

### 1. Prerequisites
- Node.js (version 12 or higher)
- Your Bodis API key

### 2. Configuration
Your API key is already configured in the `script.js` file:
```javascript
const BODIS_API_KEY = 'bBS3E56k6tyW4MjmBvTQql6QH7KE9shd';
```

### 3. Running the Dashboard

#### Option A: Using Node.js (Recommended)
```bash
# Navigate to the dashboard directory
cd bodis-revenue-dashboard

# Start the server
npm start
```

#### Option B: Direct file access
Simply open `index.html` in your web browser, but note that API calls may be blocked due to CORS restrictions.

### 4. Access the Dashboard
Once the server is running, open your web browser and go to:
```
http://localhost:3000
```

## API Integration

The dashboard attempts to connect to the Bodis API using multiple endpoint patterns:
- `/reports/revenue`
- `/api/reports/revenue`
- `/v1/reports/revenue`
- `/reports?type=revenue`

If the API connection fails, the dashboard will display mock data for demonstration purposes.

## Dashboard Components

### Summary Cards
- **7-Day Total**: Total revenue for the past 7 days
- **Today's Revenue**: Current day earnings (updates in real-time)
- **Daily Average**: Average daily revenue across the 7-day period

### Daily Breakdown
Detailed view showing revenue for each of the past 7 days, organized from most recent to oldest.

### Auto-Refresh
The dashboard automatically refreshes data every 5 minutes. You can also manually refresh using the "Refresh" button.

## Troubleshooting

### API Connection Issues - CURRENT ISSUE ⚠️
The dashboard is currently unable to connect to the Bodis API. Here are the solutions:

#### Immediate Solution: Manual Entry Dashboard
Use the manual entry version while we resolve the API issue:
```bash
# Open the manual entry dashboard
open dashboard-manual.html
```
This version lets you manually enter your daily revenue data and provides the same beautiful dashboard experience.

#### API Testing & Diagnosis
Run the API test script to identify the exact issue:
```bash
node test-api.js
```
This script will:
- Test multiple possible API endpoints
- Show detailed error messages
- Identify if it's an authentication, endpoint, or network issue
- Provide specific next steps

#### Common API Issues
1. **Invalid API Key**: Verify your key is correct and active in your Bodis account
2. **Wrong Base URL**: The actual Bodis API URL may be different than what we're testing
3. **Endpoint Changes**: Bodis may have updated their API endpoints
4. **IP Restrictions**: Your IP may need to be whitelisted
5. **Account Permissions**: Your account may not have API access enabled

#### How to Fix the API Integration
Once you identify the correct endpoint from the test script:

1. **Update the API configuration** in `script.js`:
   ```javascript
   const BODIS_API_BASE_URLS = [
       'https://correct-api-url.com'  // Replace with working URL
   ];
   ```

2. **Contact Bodis Support** if needed:
   - Email: support@bodis.com
   - Request: API endpoint documentation and troubleshooting
   - Provide: Your API key and error messages from test script

### Mock Data Mode
If the API is unavailable, the dashboard will automatically switch to mock data mode for demonstration purposes. This data is randomly generated and updates with each refresh.

### Browser Compatibility
The dashboard is compatible with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Styling
All styles are contained in the `<style>` section of `index.html`. You can modify:
- Colors and gradients
- Card layouts
- Typography
- Responsive breakpoints

### API Configuration
Modify the API configuration in `script.js`:
```javascript
const BODIS_API_BASE_URL = 'https://api.bodis.com'; // Adjust if needed
```

### Refresh Interval
Change the auto-refresh interval (currently 5 minutes):
```javascript
setInterval(loadRevenueData, 5 * 60 * 1000); // 5 minutes in milliseconds
```

## Security Notes

- API key is included in the client-side code. For production use, consider implementing a backend proxy to keep the API key secure.
- The dashboard currently uses HTTPS for API requests, which is recommended for security.

## Support

If you encounter issues with the Bodis API integration, contact Bodis support at support@bodis.com for assistance with:
- API key validation
- Endpoint documentation
- Rate limiting information
- Data format specifications