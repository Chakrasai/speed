require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors(
    {
        origin: [
            'http://localhost:5173',
            'https://speed-one-sooty.vercel.app'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        // Add additional headers to help with connection stability
        allowedHeaders: ['Content-Type', 'Authorization', 'Connection'],
        exposedHeaders: ['Content-Length', 'Content-Type']
    }
));

app.use(express.raw({ limit: '100mb', type: '*/*' }));

// Add connection management middleware
app.use((req, res, next) => {
    // Set keep-alive headers to help with connection stability
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=30, max=1000');
    next();
});


app.get('/ping',(req,res)=>{
    res.send("sent pong");
})

//download test
app.get('/download',(req,res)=>{
    const sizeinMB = 40;
    const buffer = Buffer.alloc(sizeinMB*1024*1024,'a');
    res.setHeader('content-type','application/octet-stream');
    res.send(buffer);
})

//upload test 
app.post('/upload',(req,res)=>{
    try {
        // Set appropriate headers for upload response
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        
        // Log the upload size for debugging
        const uploadSize = req.body ? req.body.length : 0;
        console.log(`Upload received: ${uploadSize} bytes`);
        
        res.status(200).json({ 
            message: "upload-received", 
            size: uploadSize,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
})



app.listen(3000, () => {
    console.log("running at 3000");
});