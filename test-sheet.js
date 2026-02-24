const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function testGoogleAccess() {
    const keyPath = path.join(process.env.HOME, '.config/gog/vulkn-service-account.json');
    if (!fs.existsSync(keyPath)) {
        console.error(`Error: Service account key not found at ${keyPath}`);
        process.exit(1);
    }
    
    const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const auth = new google.auth.JWT({
        email: keyFile.client_email,
        key: keyFile.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    try {
        const res = await sheets.spreadsheets.create({
            resource: { properties: { title: "Cloud Agent Google Test" } }
        });
        console.log('✅ Success! Created Sheet:', res.data.spreadsheetUrl);
    } catch (err) {
        console.error('❌ Google API Error:', err.message);
    }
}

testGoogleAccess();
