import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const emotionsList = [
  "Neutral",
  "Happiness",
  "Sadness",
  "Anger",
  "Fear",
  "Disgust",
  "Surprise",
  "Contempt",
];

export default function useEmotionModule({
  studentId,
  assessmentId,
  sessionType,
  moduleId,
  moduleName,
  nextRouteOnComplete,
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const successSound = useRef(null);
  const failSound = useRef(null);
  const intervalRef = useRef(null);

  const [moduleProgressId, setModuleProgressId] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState("Not detected yet");
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [trial, setTrial] = useState(1);
  const [results, setResults] = useState([]);
  const [lastSavedResult, setLastSavedResult] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);

  const [showReward, setShowReward] = useState(false);
  const [startTest, setStartTest] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [savingTrial, setSavingTrial] = useState(false);

  const [showAssistancePrompt, setShowAssistancePrompt] = useState(false);
  const [pendingEmotionForAssistance, setPendingEmotionForAssistance] = useState(null);
  const [savingAssistance, setSavingAssistance] = useState(false);

  const [trialStartTime, setTrialStartTime] = useState(Date.now());

  const currentEmotion = emotionsList[currentEmotionIndex] || emotionsList[0];

  useEffect(() => {
    successSound.current = new Audio("/sounds/success.mp3");
    failSound.current = new Audio("/sounds/fail.mp3");
  }, []);

  useEffect(() => {
    if (!assessmentId || !studentId || !sessionType) return;

    const redirectToCurrentModule = (nextModule) => {
      if (nextModule === 1) {
        navigate(`/module1/${studentId}/${assessmentId}/${sessionType}`);
        return;
      }
      if (nextModule === 2) {
        navigate(`/module2/${studentId}/${assessmentId}/${sessionType}`);
        return;
      }
      if (nextModule === 3) {
        navigate(`/module3/${studentId}/${assessmentId}/${sessionType}`);
        return;
      }
      alert("All modules completed.");
    };

    const startOrResumeModule = async () => {
      try {
        setLoadingProgress(true);

        const response = await fetch("http://localhost:5000/api/modules/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            studentId,
            sessionType,
            moduleId,
            moduleName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.currentModule) {
            redirectToCurrentModule(Number(data.currentModule));
            return;
          }
          throw new Error(data.error || "Failed to start/resume module");
        }

        const progress = data.data;
        const savedTrials = progress.trials || [];

        setModuleProgressId(progress._id);
        setCurrentEmotionIndex(progress.currentEmotionIndex || 0);
        setTrial(progress.currentTrialNumber || 1);
        setResults(savedTrials);

        if (savedTrials.length > 0 || progress.status === "in_progress") {
          setStartTest(true);
          setCameraOn(true);
        }

        if (savedTrials.length > 0) {
          setLastSavedResult(savedTrials[savedTrials.length - 1]);
        }

        setTrialStartTime(Date.now());
      } catch (error) {
        console.error(error);
        alert(error.message || `Failed to load ${moduleName}`);
      } finally {
        setLoadingProgress(false);
      }
    };

    startOrResumeModule();
  }, [assessmentId, studentId, sessionType, moduleId, moduleName, navigate]);

  useEffect(() => {
    if (!cameraOn) return;

    let stream;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Camera access failed");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraOn]);

  useEffect(() => {
    if (!cameraOn || showAssistancePrompt) return;

    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;
      if (video.readyState !== 4) return;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 320;
      tempCanvas.height = 240;

      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.drawImage(video, 0, 0, 320, 240);
      const imageData = tempCanvas.toDataURL("image/jpeg", 0.7);

      try {
        const res = await fetch("http://localhost:5001/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });

        const data = await res.json();
        setDetectedEmotion(data.emotion || "Unknown");

        const safeCanvas = canvasRef.current;
        const safeVideo = videoRef.current;

        if (!safeCanvas || !safeVideo) return;

        const ctx2 = safeCanvas.getContext("2d");
        if (!ctx2) return;

        safeCanvas.width = safeVideo.videoWidth || 640;
        safeCanvas.height = safeVideo.videoHeight || 480;
        ctx2.clearRect(0, 0, safeCanvas.width, safeCanvas.height);

        if (data.box) {
          const [x, y, w, h] = data.box;
          const scaleX = safeCanvas.width / 320;
          const scaleY = safeCanvas.height / 240;

          ctx2.strokeStyle = "lime";
          ctx2.lineWidth = 3;
          ctx2.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);

          ctx2.fillStyle = "lime";
          ctx2.font = "18px Arial";
          ctx2.fillText(data.emotion, x * scaleX, y * scaleY - 10);
        }
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraOn, showAssistancePrompt]);

  const startModuleTest = () => {
    setStartTest(true);
    setCameraOn(true);
    setTrialStartTime(Date.now());
  };

  const handleDetectPreview = () => {
    try {
      setDetecting(true);

      const timeTaken = Number(((Date.now() - trialStartTime) / 1000).toFixed(2));
      const score = detectedEmotion === currentEmotion ? 1 : 0;

      const nextPreview = {
        emotion: currentEmotion,
        trialNumber: trial,
        detectedEmotion,
        score,
        timeTaken,
      };

      setPreviewResult(nextPreview);

      if (score === 1) {
        setShowReward(false);
        setTimeout(() => setShowReward(true), 10);

        if (successSound.current) {
          successSound.current.currentTime = 0;
          successSound.current.play().catch(() => {});
        }

        setTimeout(() => setShowReward(false), 1500);
      } else {
        if (failSound.current) {
          failSound.current.currentTime = 0;
          failSound.current.play().catch(() => {});
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to preview detection");
    } finally {
      setDetecting(false);
    }
  };

  const handleNextTrial = async () => {
    if (!moduleProgressId) {
      alert("Module progress not loaded yet.");
      return;
    }

    if (!previewResult) {
      alert("Please click Detect first before moving to the next trial.");
      return;
    }

    try {
      setSavingTrial(true);

      const completedEmotion = previewResult.emotion;
      const completedTrialNumber = previewResult.trialNumber;

      const response = await fetch(`http://localhost:5000/api/modules/${moduleProgressId}/trial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emotion: previewResult.emotion,
          score: previewResult.score,
          detectedEmotion: previewResult.detectedEmotion,
          timeTaken: previewResult.timeTaken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save trial");
      }

      const updated = data.data;

      setResults(updated.trials || []);
      setCurrentEmotionIndex(updated.currentEmotionIndex || 0);
      setTrial(updated.currentTrialNumber || 1);
      setLastSavedResult(previewResult);

      setPreviewResult(null);
      setTrialStartTime(Date.now());

      if (completedTrialNumber === 3) {
        setPendingEmotionForAssistance(completedEmotion);
        setShowAssistancePrompt(true);
        return;
      }

      if (updated.status === "completed") {
        setCameraOn(false);
        navigate(`${nextRouteOnComplete}/${studentId}/${assessmentId}/${sessionType}`, {
          state: {
            moduleId,
            moduleName,
            results: updated.trials,
            assessmentId,
            studentId,
            sessionType,
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert(`${error.message || "Failed to save trial"}`);
    } finally {
      setSavingTrial(false);
    }
  };

  const handleSaveAssistance = async (assistanceUsed) => {
    if (!moduleProgressId || !pendingEmotionForAssistance) return;

    try {
      setSavingAssistance(true);

      const response = await fetch(
        `http://localhost:5000/api/modules/${moduleProgressId}/assistance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emotion: pendingEmotionForAssistance,
            assistanceUsed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save assistance");
      }

      const updated = data.data;
      setResults(updated.trials || []);
      setShowAssistancePrompt(false);
      setPendingEmotionForAssistance(null);

      if (updated.status === "completed") {
        setCameraOn(false);
        navigate(`${nextRouteOnComplete}/${studentId}/${assessmentId}/${sessionType}`, {
          state: {
            moduleId,
            moduleName,
            results: updated.trials,
            assessmentId,
            studentId,
            sessionType,
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert(`${error.message || "Failed to save assistance"}`);
    } finally {
      setSavingAssistance(false);
    }
  };

  return {
    emotionsList,
    currentEmotion,
    currentEmotionIndex,
    trial,
    results,
    detectedEmotion,
    lastSavedResult,
    previewResult,
    showReward,
    startTest,
    cameraOn,
    loadingProgress,
    detecting,
    savingTrial,
    videoRef,
    canvasRef,
    startModuleTest,
    handleDetectPreview,
    handleNextTrial,
    setPreviewResult,
    showAssistancePrompt,
    pendingEmotionForAssistance,
    handleSaveAssistance,
    savingAssistance,
  };
}