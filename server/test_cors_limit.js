const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.post('/test', (req, res) => {
    res.json({ success: true });
});

app.listen(5001, () => console.log('Listening on 5001'));
