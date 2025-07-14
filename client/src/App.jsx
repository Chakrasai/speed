import React from 'react'
import { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function App() {

  const [downloadspeed, setdownloadspeed] = useState();
  const [uploadspeed, setUploadspeed] = useState();
  const [ping,setping] = useState();
  const [isTesting, setIsTesting] = useState(false);




  const handleclick = async () => {
    setIsTesting(true);
    setdownloadspeed(null);
    setUploadspeed(null);
    setping(null);

    console.log('Button clicked!');

    try {
  const pingstart = performance.now();
  await fetch(`${import.meta.env.VITE_API_URL}/ping`);
  const pingend = performance.now();
  setping(parseFloat((pingend - pingstart).toFixed(2)));
} catch {
  setping(0); // Set to 0 if failed
}

    try {
      const downloadstart = performance.now();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/download`);
      const blob = await res.blob();
      const downloadend = performance.now();
      const download = ((blob.size * 8) / ((downloadend - downloadstart) / 1000) / (1024 * 1024)).toFixed(2);
      setdownloadspeed(parseFloat(download));
    } catch {
      setdownloadspeed(0);
    }

    try {
      const uplaoddata = new Uint8Array(20 * 1024 * 1024);
      const uploadstart = performance.now();
      await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        body: uplaoddata
      });
      const uploadend = performance.now();
      const upload = ((uplaoddata.length * 8) / ((uploadend - uploadstart) / 1000) / (1024 * 1024)).toFixed(2);
      setUploadspeed(parseFloat(upload));
    } catch {
      setUploadspeed(0);
    }
    setIsTesting(false)
  }

  const speedometer = (value,label,color) =>(
    <div className="flex flex-col items-center w-32">
      <CircularProgressbar
        value={value}
        maxValue={1000}
        text={`${value ?? 0}`}
        styles={buildStyles({
          textColor: '#333',
          pathColor: color,
          trailColor: '#eee',
        })}
      />
      <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🌐 NetSpeed</h1>

      <button
        onClick={handleclick}
        disabled={isTesting}
        className={`mb-10 px-6 py-3 rounded text-white font-semibold transition ${
          isTesting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } w-full max-w-xs`}
      >
        {isTesting ? 'Testing...' : 'Check Speed'}
      </button>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center w-full justify-center">
        <div className="relative flex flex-col items-center w-32">
          {isTesting && ping == null && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded">
              <svg className="animate-spin h-8 w-8 text-yellow-400 border-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          )}
          {speedometer(ping, 'Ping (ms)', '#facc15')}
        </div>
        <div className="relative flex flex-col items-center w-32">
          {isTesting && downloadspeed == null && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded">
              <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          )}
          {speedometer(downloadspeed, 'Download (Mbps)', '#10b981')}
        </div>
        <div className="relative flex flex-col items-center w-32">
          {isTesting && uploadspeed == null && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          )}
          {speedometer(uploadspeed, 'Upload (Mbps)', '#3b82f6')}
        </div>
      </div>

      {downloadspeed && uploadspeed && ping && (
        <p className="mt-8 text-gray-600 text-center">✅ Test Complete</p>
      )}
    </div>
  );
}

export default App
