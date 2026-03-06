const http = require('http');

const data = JSON.stringify({
    fullName: 'Final Test User ' + Date.now(),
    email: 'final@test.com',
    phone: '+91-8128704400',
    program: 'Full Stack Development',
    package: 'Pro',
    experience: '3',
    readyToCommit: 'Yes',
    message: 'Testing end-to-end flow for MongoDB and HR Email.'
});

const options = {
    hostname: '127.0.0.1',
    port: 5002,
    path: '/api/forms/submit',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => responseData += chunk);
    res.on('end', () => {
        console.log('✅ Response Status:', res.statusCode);
        console.log('✅ Response:', responseData);
        process.exit(0);
    });
});

req.on('error', (err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});

console.log('Sending final test submission to 127.0.0.1:5002...');
req.write(data);
req.end();
