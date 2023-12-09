const express = require('express');
const cors = require('cors');

const app = express();
const appPort = 4002;

app.use(express.json());

app.get('/posts', (req, res) => {

});

app.post('/events', (req, res) => {

});

app.listen(appPort, () => {
    console.log(`[Query-Service] listening on http://localhost:${appPort} 🚀`);
});