const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.raw({ limit: '100mb', type: '*/*' }));


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
    res.send("upload-received");
})



app.listen(3000, () => {
    console.log("running at 3000");
});