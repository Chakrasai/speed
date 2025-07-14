require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------
// 1. CORS Setup
// ----------------------
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://speed-one-sooty.vercel.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Connection'],
    exposedHeaders: ['Content-Length', 'Content-Type']
}));

// ----------------------
// 2. Middlewares
// ----------------------
app.use(express.raw({ limit: '200mb', type: '*/*' }));

// Set common headers
app.use((req, res, next) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=30, max=1000');
    res.setHeader('Cache-Control', 'no-store'); // avoid caching
    next();
});

// ----------------------
// 3. Ping Test
// ----------------------
app.get('/ping', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send("pong");
});

// ----------------------
// 4. Download Test
// ----------------------
// Optional: /download?size=40
app.get('/download', (req, res) => {
    try {
        const sizeMB = parseInt(req.query.size) || 40; // default to 40MB
        const buffer = Buffer.alloc(sizeMB * 1024 * 1024, 'a');
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);

        console.log(`Download: Sent ${sizeMB}MB (${buffer.length} bytes)`);
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).send('Download failed');
    }
});

// ----------------------
// 5. Upload Test
// ----------------------
app.post('/upload', (req, res) => {
    try {
        const size = req.body?.length || 0;
        console.log(`Upload: Received ${size} bytes`);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');

        res.status(200).json({
            message: 'upload-received',
            size: size,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// ----------------------
// 6. Start Server
// ----------------------
app.listen(PORT, () => {
    console.log(`🚀 Speed test server running at http://localhost:${PORT}`);
});
