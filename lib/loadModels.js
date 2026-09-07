"use client";
// lib/loadModels.js
// Loads the face-api.js model files (from /public/models) into the browser.
// Only needs to happen once per page visit.

let modelsLoaded = false;
let faceApiPromise;

function loadFaceApi() {
  faceApiPromise ??= import("face-api.js");
  return faceApiPromise;
}

export async function loadModels() {
  if (modelsLoaded) return;
  const faceapi = await loadFaceApi();
  const MODEL_URL = "/models";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

// Detects a single face in a video/image element and returns its
// 128-number descriptor (the "fingerprint" used for matching).
// Returns null on any failure (no face found, video not ready, or an
// internal detector error) so the caller can show one clean message
// instead of a raw crash.
export async function getFaceDescriptor(mediaElement) {
  try {
    const faceapi = await loadFaceApi();

    // Guard against calling this before the video actually has a frame ready.
    if (!mediaElement || mediaElement.readyState < 2 || !mediaElement.videoWidth) {
      return null;
    }

    const detection = await faceapi
      .detectSingleFace(mediaElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection ? Array.from(detection.descriptor) : null;
  } catch (err) {
    console.error("Face detection error:", err);
    return null;
  }
}

// Compares two descriptors and returns how "far apart" the faces are.
// Lower = more similar. Below ~0.5 is generally considered a match.
export function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}
