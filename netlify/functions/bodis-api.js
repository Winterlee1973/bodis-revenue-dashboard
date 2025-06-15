const https = require('https');

const BODIS_API_KEY = 'bBS3E56k6tyW4MjmBvTQql6QH7KE9shd';

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const requestData = JSON.parse(event.body);
        
        // Create request to Bodis API
        const bodisRequestBody = {
            "report_type": "day",
            "order_by": "date",
            "sort_order": "desc",
            "page": 1,
            "per_page": 10,
            "filter": {
                "date_range": requestData.date_range
            }
        };
        
        console.log('Making request to Bodis API for date range:', requestData.date_range);
        
        const response = await makeHttpsRequest(bodisRequestBody);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

function makeHttpsRequest(requestBody) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(requestBody);
        
        const options = {
            hostname: 'api.bodis.com',
            port: 443,
            path: '/v2/reports/search',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BODIS_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (e) {
                        reject(new Error('Invalid JSON response from Bodis API'));
                    }
                } else {
                    reject(new Error(`Bodis API returned status ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.write(postData);
        req.end();
    });
}