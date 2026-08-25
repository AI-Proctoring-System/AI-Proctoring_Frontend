'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SystemCheckProps {
  onComplete: () => void;
}

export default function SystemCheck({ onComplete }: SystemCheckProps) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMic, setSelectedMic] = useState<string>('');
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [hasDetectedSound, setHasDetectedSound] = useState<boolean>(false);
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Initial load to request permissions and fetch devices
  useEffect(() => {
    async function initDevices() {
      try {
        setIsInitializing(true);
        setError(null);
        
        // Request initial permissions to trigger the browser prompt and get labels
        const initialStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        // Stop the initial stream tracks right away, we just needed it for permissions/labels
        initialStream.getTracks().forEach(track => track.stop());
        setPermissionsGranted(true);

        // Fetch all devices now that we have permissions (labels will be visible)
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        const audioDevices = devices.filter(d => d.kind === 'audioinput');
        
        setCameras(videoDevices);
        setMicrophones(audioDevices);
        
        if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
        if (audioDevices.length > 0) setSelectedMic(audioDevices[0].deviceId);

      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Camera and Microphone permissions are required to proceed. Please allow access in your browser settings and refresh.');
        setPermissionsGranted(false);
      } finally {
        setIsInitializing(false);
      }
    }
    initDevices();

    return () => {
      stopMedia();
    };
  }, []);

  // Effect to update stream when selected devices change
  useEffect(() => {
    if (!permissionsGranted || !selectedCamera || !selectedMic) return;

    async function startStream() {
      try {
        stopMedia();
        setError(null);

        // Low memory constraints
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 15 }
          },
          audio: { 
            deviceId: selectedMic ? { exact: selectedMic } : undefined 
          }
        });

        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        setupAudioAnalyzer(newStream);
      } catch (err) {
        console.error('Error starting specific stream:', err);
        setError('Failed to access selected camera or microphone. They might be in use by another application.');
      }
    }

    startStream();
  }, [selectedCamera, selectedMic, permissionsGranted]);

  const setupAudioAnalyzer = (mediaStream: MediaStream) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const volumePercentage = Math.min(100, Math.round((average / 128) * 100));
        
        setAudioLevel(volumePercentage);
        
        if (volumePercentage > 10) {
          setHasDetectedSound(true);
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (err) {
      console.error('Audio setup error:', err);
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    setStream(null);
  };

  const handleProceed = () => {
    stopMedia();
    onComplete();
  };

  if (isInitializing) {
    return (
      <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Requesting Permissions</h2>
        <p className="text-sm text-neutral-500">Please allow camera and microphone access when prompted by your browser.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-lg bg-white rounded-2xl border border-red-100 p-8 shadow-xs space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-neutral-900">Device Error</h2>
        <p className="text-sm text-neutral-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs space-y-6">
      <div className="text-center">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-sm font-bold">2</span>
        <h2 className="text-xl font-bold text-neutral-900 mt-3 font-display">Hardware System Check</h2>
        <p className="text-xs text-neutral-400 mt-1">Verify your camera and microphone are working properly before proceeding.</p>
      </div>

      <div className="space-y-4 bg-neutral-50 p-5 rounded-xl">
        {/* Selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Camera</label>
            <select 
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            >
              {cameras.map(cam => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Camera ${cameras.indexOf(cam) + 1}`}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Microphone</label>
            <select 
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            >
              {microphones.map(mic => (
                <option key={mic.deviceId} value={mic.deviceId}>
                  {mic.label || `Microphone ${microphones.indexOf(mic) + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video w-full rounded-lg bg-neutral-900 overflow-hidden border border-neutral-800">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          {!stream && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-neutral-400">Loading feed...</span>
            </div>
          )}
        </div>

        {/* Audio Meter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-700">Microphone Level</label>
            {hasDetectedSound && (
              <span className="text-2xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Sound Detected</span>
            )}
          </div>
          <div className="h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div 
              className="h-full bg-brand-green transition-all duration-75"
              style={{ width: `${Math.min(100, Math.max(0, audioLevel))}%` }}
            ></div>
          </div>
          <p className="text-3xs text-neutral-500 text-center">Please speak a few words to test your microphone.</p>
        </div>
      </div>

      <button
        type="button"
        disabled={!stream || !hasDetectedSound}
        onClick={handleProceed}
        className="w-full rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {hasDetectedSound ? 'Proceed to Identity Check' : 'Waiting for microphone sound...'}
      </button>
    </div>
  );
}
