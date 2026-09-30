const video = document.getElementById("webcam");
const cameraStatus = document.querySelector(".camera-status");

let detector;

// Start webcam
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
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


// Setup hand tracking
async function startHandTracking() {

  console.log("Loading hand tracking model...");

  detector = await handPoseDetection.createDetector(
    handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: "mediapipe",
      modelType: "full",
      maxHands: 1,
      solutionPath:
        "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
    }
  );

  console.log("Hand tracking model loaded!");

  detectHands();
}


// Detect hand
async function detectHands() {

  const hands = await detector.estimateHands(video);

  if (hands.length > 0) {

    const hand = hands[0];

    console.log("Hand detected!", hand.keypoints);

  }

  requestAnimationFrame(detectHands);
}


startWebcam();