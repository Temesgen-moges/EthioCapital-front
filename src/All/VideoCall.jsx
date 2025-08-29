import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Generate random ID
function randomID(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Extract roomID from URL
function getUrlParams(url = window.location.href) {
  const query = url.split('?')[1];
  return new URLSearchParams(query);
}

export default function VideoCall() {
  const containerRef = useRef(null);
  const roomID = getUrlParams().get('roomID') || randomID(5);

  useEffect(() => {
    const appID = 384600951;
    const serverSecret = '5dfee84a59b3a8b1aa2ae1f81fc0fc8f';
    const userID = randomID(5);
    const userName = "User_" + userID;

    // Request access to camera and microphone explicitly
    const getMedia = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          showScreenSharingButton: true,
        });
      } catch (err) {
        console.error("Error accessing media devices: ", err);
        alert("Please allow camera and microphone access.");
      }
    };

    getMedia();
  }, [roomID]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}

// function VideoCall() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const appID = 384600951; 
//     const serverSecret = '5dfee84a59b3a8b1aa2ae1f81fc0fc8f'; 
//     const roomID = 'my-room-123'; 
//     const userID = String(Math.floor(Math.random() * 10000)); // Make userID unique
//     const userName = 'User ' + userID;

//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appID,
//       serverSecret,
//       roomID,
//       userID,
//       userName
//     );

//     const zp = ZegoUIKitPrebuilt.create(kitToken);
//     zp.joinRoom({
//       container: containerRef.current,
//       scenario: {
//         mode: ZegoUIKitPrebuilt.OneONoneCall, // or .VideoCall if you want group call
//       },
//     });
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// }

// export default VideoCall;
