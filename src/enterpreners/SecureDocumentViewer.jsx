import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useParams } from 'react-router-dom';

const SecureDocumentViewer = () => {
  const { documentPath } = useParams(); // Use documentPath to match the route
  const decodedPath = decodeURIComponent(documentPath); // Decode the URL-encoded path
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      downloadPlugin: { disabled: true },
      printPlugin: { disabled: true },
    },
  });

  const [error, setError] = useState(null);

  // Watermark and security useEffect
  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    const preventSelection = () => window.getSelection().removeAllRanges();

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelection);

    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.top = '50%';
    watermark.style.left = '50%';
    watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    watermark.style.fontSize = '48px';
    watermark.style.color = 'rgba(255, 0, 0, 0.2)';
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '1000';
    watermark.textContent = 'Confidential - Do Not Share';
    document.body.appendChild(watermark);

    const detectScreenshot = (e) => {
      if (e.key === 'PrintScreen') {
        alert('Screenshots are not allowed.');
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', detectScreenshot);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelection);
      window.removeEventListener('keydown', detectScreenshot);
      if (document.body.contains(watermark)) {
        document.body.removeChild(watermark);
      }
    };
  }, []);

  // Debug fetch useEffect
  useEffect(() => {
    if (!decodedPath || typeof decodedPath !== 'string') {
      setError('Invalid document path.');
      return;
    }

    // Ensure the path is normalized (remove leading slashes if any)
    const normalizedPath = decodedPath.startsWith('/') ? decodedPath.slice(1) : decodedPath;
    const fullUrl = `http://localhost:3001/${normalizedPath}`;
    console.log('SecureDocumentViewer decodedPath:', decodedPath);
    console.log('Full URL:', fullUrl);

    fetch(fullUrl, { method: 'GET', headers: { Accept: 'application/pdf' } })
      .then((response) => {
        console.log('Fetch response:', response.status, response.headers.get('content-type'));
        if (response.status !== 200) {
          setError(`Failed to fetch document: Status ${response.status}`);
          return null;
        }
        if (!response.headers.get('content-type').includes('application/pdf')) {
          setError(`Invalid content type: ${response.headers.get('content-type')}`);
          return null;
        }
        return response.blob();
      })
      .then((blob) => {
        if (blob) {
          console.log('Blob type:', blob.type, 'Size:', blob.size);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err.message);
        setError(`Fetch error: ${err.message}`);
      });
  }, [decodedPath]);

  if (!decodedPath || typeof decodedPath !== 'string' || error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">{error || 'Invalid document path.'}</p>
      </div>
    );
  }

  // Construct the full URL for the Viewer
  const fullUrl = `http://localhost:3001/${decodedPath.startsWith('/') ? decodedPath.slice(1) : decodedPath}`;

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
      }}
    >
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
        <Viewer
          fileUrl={fullUrl}
          plugins={[defaultLayoutPluginInstance]}
          withCredentials={false}
          httpHeaders={{
            'X-Prevent-Download': 'true',
            'Accept': 'application/pdf',
          }}
          onDocumentLoad={() => console.log('Document loaded successfully')}
          onDocumentError={(e) => {
            console.error('Document error:', e.message, e);
            setError(
              `Failed to load document: ${e.message}. Check if the file is accessible and a valid PDF.`
            );
          }}
        />
      </Worker>
    </div>
  );
};

export default SecureDocumentViewer;