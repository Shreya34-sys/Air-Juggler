const video = document.getElementById("webcam");
const cameraStatus = document.querySelector(".camera-status");
const trackingStatus = document.querySelector(".tracking-status");

let detector;

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    video.srcObject = stream;

    await video.play();

    cameraStatus.textContent = "● Camera Connected";

    console.log("Webcam started!");

    await startHandTracking();
  } catch (error) {
    console.error("Webcam error:", error);
    cameraStatus.textContent = "● Camera Access Denied";
  }
}

async function startHandTracking() {
  console.log("Loading hand tracking model...");

  trackingStatus.innerHTML = `
  <span class="status-dot loading"></span>
  <span>Loading Hand Tracking...</span>
`;

  detector = await handPoseDetection.createDetector(
    handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: "mediapipe",
      modelType: "full",
      maxHands: 1,
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    },
  );

  console.log("Hand tracking model loaded!");

  trackingStatus.innerHTML = `
  <span class="status-dot"></span>
  <span>Hand Tracking Ready</span>
`;

  detectHands();
}
async function detectHands() {
  const hands = await detector.estimateHands(video);

  if (hands.length > 0) {
    trackingStatus.innerHTML = `
      <span class="status-dot"></span>
      <span>🟢 Hand Detected</span>
    `;

    const indexFinger = hands[0].keypoints.find(
      (point) => point.name === "index_finger_tip",
    );

    if (indexFinger) {
      const x = indexFinger.x / video.videoWidth;
      const y = indexFinger.y / video.videoHeight;

      updateCatcher(x, y);
      updateCatcher(x, y);
    }
  } else {
    trackingStatus.innerHTML = `
      <span class="status-dot no-hand"></span>
      <span>🟡 No Hand Detected</span>
    `;
  }

  requestAnimationFrame(detectHands);
}

startWebcam();
