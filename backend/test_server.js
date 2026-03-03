const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Test server OK'));
app.listen(5002, () => console.log('Test server on 5002'));
