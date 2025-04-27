import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useParams } from "react-router-dom";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";

// Optional: Use local pdfjs-dist worker (uncomment after installing pdfjs-dist@3.0.279)
// import * as pdfjs from "pdfjs-dist/build/pdf.worker.entry";

const SecureDocumentViewer = () => {
  const { documentPath } = useParams(); // Use documentPath to match the route
  const decodedPath = decodeURIComponent(documentPath); // Decode the URL-encoded path

  // Create toolbar plugin instance with minimal controls
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  // Configure default layout with custom toolbar
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Disable sidebar (thumbnails, bookmarks, etc.)
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            ZoomIn,
            ZoomOut,
          } = slots;
          return (
            <div
              style={{
                alignItems: "center",
                display: "flex",
                padding: "8px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div style={{ padding: "0 4px" }}>
                <ZoomOut />
              </div>
              <div style={{ padding: "0 4px" }}>
                <ZoomIn />
              </div>
              <div style={{ padding: "0 4px" }}>
                <GoToPreviousPage />
              </div>
              <div style={{ padding: "0 4px", width: "80px" }}>
                <CurrentPageInput />
              </div>
              <div style={{ padding: "0 4px" }}>
                / <NumberOfPages />
              </div>
              <div style={{ padding: "0 4px" }}>
                <GoToNextPage />
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
    toolbarPlugin: {
      downloadPlugin: { disabled: true }, // Disable download
      printPlugin: { disabled: true }, // Disable print
      fullScreenPlugin: { disabled: true }, // Disable full-screen
      openPlugin: { disabled: true }, // Disable open file
    },
  });

  const [error, setError] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  // Enhanced security useEffect
  useEffect(() => {
    // Prevent context menu (right-click)
    const preventContextMenu = (e) => e.preventDefault();
    // Prevent text selection
    const preventSelection = () => window.getSelection().removeAllRanges();
    // Prevent common shortcuts (save, print, screenshot)
    const preventShortcuts = (e) => {
      if (
        (e.key === "PrintScreen") ||
        (e.ctrlKey && (e.key === "s" || e.key === "p" || e.key === "c")) || // Ctrl+S, Ctrl+P, Ctrl+C
        (e.metaKey && (e.key === "s" || e.key === "p" || e.key === "c")) // Cmd+S, Cmd+P, Cmd+C on Mac
      ) {
        e.preventDefault();
        alert("This action is not allowed to protect confidential content.");
      }
    };
    // Attempt to block DevTools (not foolproof)
    const blockDevTools = (e) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I
        (e.key === "F12") // F12
      ) {
        e.preventDefault();
        alert("Developer tools are disabled for security reasons.");
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("keydown", preventShortcuts);
    document.addEventListener("keydown", blockDevTools);

    // Add prominent watermark
    const watermark = document.createElement("div");
    watermark.style.position = "fixed";
    watermark.style.top = "50%";
    watermark.style.left = "50%";
    watermark.style.transform = "translate(-50%, -50%) rotate(-45deg)";
    watermark.style.fontSize = "72px";
    watermark.style.fontWeight = "bold";
    watermark.style.color = "rgba(255, 0, 0, 0.3)";
    watermark.style.pointerEvents = "none";
    watermark.style.zIndex = "1000";
    watermark.style.textTransform = "uppercase";
    watermark.textContent = "Confidential - Investor Use Only";
    document.body.appendChild(watermark);

    // Add overlay to deter screenshots
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "999";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("keydown", preventShortcuts);
      document.removeEventListener("keydown", blockDevTools);
      if (document.body.contains(watermark)) {
        document.body.removeChild(watermark);
      }
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, []);

  // Fetch and validate PDF useEffect
  useEffect(() => {
    if (!decodedPath || typeof decodedPath !== "string") {
      setError("Invalid document path.");
      return;
    }

    // Normalize the path (remove leading slashes if any)
    const normalizedPath = decodedPath.startsWith("/")
      ? decodedPath.slice(1)
      : decodedPath;
    const fullUrl = `http://localhost:3001/${normalizedPath}`;
    console.log("SecureDocumentViewer decodedPath:", decodedPath);
    console.log("Full URL:", fullUrl);

    const token = localStorage.getItem("authToken");
    fetch(fullUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${token || ""}`, // Include token if available
      },
      credentials: "include",
    })
      .then((response) => {
        console.log(
          "Fetch response:",
          response.status,
          response.headers.get("content-type")
        );
        if (response.status !== 200) {
          setError(`Failed to fetch document: Status ${response.status}`);
          return null;
        }
        if (!response.headers.get("content-type").includes("application/pdf")) {
          setError(
            `Invalid content type: ${response.headers.get("content-type")}`
          );
          return null;
        }
        return response.blob();
      })
      .then((blob) => {
        if (blob) {
          console.log("Blob type:", blob.type, "Size:", blob.size);
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(blobUrl);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setError(`Fetch error: ${err.message}`);
      });

    // Cleanup blob URL on unmount
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [decodedPath]);

  if (!decodedPath || typeof decodedPath !== "string" || error || !pdfBlobUrl) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">
          {error || "Loading document... Please wait."}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        cursor: "default",
      }}
    >
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfBlobUrl}
          plugins={[defaultLayoutPluginInstance, toolbarPluginInstance]}
          withCredentials={false}
          httpHeaders={{
            "X-Prevent-Download": "true",
            Accept: "application/pdf",
          }}
          onDocumentLoad={() => console.log("Document loaded successfully")}
          onDocumentError={(e) => {
            console.error("Document error:", e.message, e);
            setError(
              `Failed to load document: ${e.message}. Check if the file is accessible and a valid PDF.`
            );
          }}
          // Disable text layer to prevent copying
          renderTextLayer={false}
        />
      </Worker>
    </div>
  );
};

export default SecureDocumentViewer;