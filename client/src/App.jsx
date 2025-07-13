import React from 'react'

import { useState } from 'react';

function App() {

  const [downloadspeed, setdownloadspeed] = useState();
  const [uploadspeed, setUploadspeed] = useState();
  const [ping,setping] = useState();

  const handleclick = async () => {
    
    console.log('Button clicked!');

    const pingstart = performance.now();
    await fetch('https://speed-backend-778g.onrender.com/ping');
    const pingend = performance.now();
    setping((pingend-pingstart).toFixed(2));


    const downloadstart = performance.now();
    const res = await fetch('https://speed-backend-778g.onrender.com/download')
    const blob = await res.blob();
    const downloadend = performance.now();
    const download = ((blob.size*8)/((downloadend-downloadstart)/1000)/(1024*1024)).toFixed(2);
    setdownloadspeed(download);

    const uplaoddata = new Uint8Array(20*1024*1024);
    const uploadstart = performance.now();
    await fetch('https://speed-backend-778g.onrender.com/upload',{
      method:'POST',
      body: uplaoddata
    })
    const uploadend = performance.now();
    const upload = ((uplaoddata.length * 8)/((uploadend-uploadstart)/1000)/(1024*1024)).toFixed(2);
    setUploadspeed(upload);


  }

  return (
    <div className="container">
      <div>
        <button onClick={handleclick} className="bg-blue-500 text-white px-4 py-2 rounded">
          Click me
        </button>
      </div>
      <div>
        <p>
          downloadSpeed : {downloadspeed}
        </p>
        <p>
          uploadspeed : {uploadspeed}
        </p>
        <p>
          ping : {ping}
        </p>
      </div>
    </div>  
  )
}

export default App
