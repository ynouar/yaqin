"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface VoiceConversationItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  isFinal: boolean;
  status?: "speaking" | "processing" | "final";
}

interface UseVoiceSessionReturn {
  status: string;
  isSessionActive: boolean;
  currentVolume: number;
  conversation: VoiceConversationItem[];
  handleStartStopClick: () => void;
}

export default function useVoiceSession(): UseVoiceSessionReturn {
  const [status, setStatus] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [conversation, setConversation] = useState<VoiceConversationItem[]>([]);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);
  const ephemeralUserMessageIdRef = useRef<string | null>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(7);

  // Get or create ephemeral user message
  const getOrCreateEphemeralUserId = useCallback((): string => {
    let ephemeralId = ephemeralUserMessageIdRef.current;
    if (!ephemeralId) {
      ephemeralId = generateId();
      ephemeralUserMessageIdRef.current = ephemeralId;

      const newMessage: VoiceConversationItem = {
        id: ephemeralId,
        role: "user",
        text: "",
        timestamp: new Date().toISOString(),
        isFinal: false,
        status: "speaking",
      };

      setConversation((prev) => [...prev, newMessage]);
    }
    return ephemeralId;
  }, []);

  // Update ephemeral user message
  const updateEphemeralUserMessage = useCallback((partial: Partial<VoiceConversationItem>) => {
    const ephemeralId = ephemeralUserMessageIdRef.current;
    if (!ephemeralId) return;

    setConversation((prev) =>
      prev.map((msg) => {
        if (msg.id === ephemeralId) {
          return { ...msg, ...partial };
        }
        return msg;
      })
    );
  }, []);

  // Clear ephemeral user message
  const clearEphemeralUserMessage = useCallback(() => {
    ephemeralUserMessageIdRef.current = null;
  }, []);

  // Calculate volume
  const getVolume = useCallback((): number => {
    if (!analyserRef.current) return 0;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const float = (dataArray[i] - 128) / 128;
      sum += float * float;
    }
    return Math.sqrt(sum / dataArray.length);
  }, []);

  // Handle data channel messages
  const handleDataChannelMessage = useCallback(async (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "input_audio_buffer.speech_started": {
          getOrCreateEphemeralUserId();
          updateEphemeralUserMessage({ status: "speaking" });
          break;
        }

        case "input_audio_buffer.committed": {
          updateEphemeralUserMessage({
            text: "Processing speech...",
            status: "processing",
          });
          break;
        }

        case "conversation.item.input_audio_transcription.completed": {
          updateEphemeralUserMessage({
            text: msg.transcript || "",
            isFinal: true,
            status: "final",
          });
          clearEphemeralUserMessage();
          break;
        }

        case "conversation.item.input_audio_transcription.failed": {
          console.error("[Voice] Transcription failed:", msg.error);
          updateEphemeralUserMessage({
            text: "Transcription failed",
            status: "final",
            isFinal: true,
          });
          clearEphemeralUserMessage();
          break;
        }

        case "response.audio_transcript.delta": {
          setConversation((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "assistant" && !lastMsg.isFinal) {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + msg.delta,
              };
              return updated;
            }
            return [...prev, {
              id: generateId(),
              role: "assistant",
              text: msg.delta,
              timestamp: new Date().toISOString(),
              isFinal: false,
            }];
          });
          break;
        }

        case "response.audio_transcript.done": {
          setConversation((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[updated.length - 1].isFinal = true;
            return updated;
          });
          break;
        }

        case "response.function_call_arguments.done": {
          if (msg.name === "queryQuran") {
            const args = JSON.parse(msg.arguments);
            
            const toolResponse = await fetch("/speak/api/tools", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tool: "queryQuran", args }),
            });
            
            const result = await toolResponse.json();

            dataChannelRef.current?.send(JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: msg.call_id,
                output: JSON.stringify(result),
              },
            }));

            dataChannelRef.current?.send(JSON.stringify({
              type: "response.create",
            }));
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error("[Voice] Error handling message:", error);
    }
  }, [getOrCreateEphemeralUserId, updateEphemeralUserMessage, clearEphemeralUserMessage]);

  // Configure data channel
  const configureDataChannel = useCallback((dataChannel: RTCDataChannel) => {
    const sessionUpdate = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        tools: [
          {
            type: "function",
            name: "queryQuran",
            description: "Search the Holy Quran for verses relevant to a question or topic using semantic search.",
            parameters: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  description: "The query to search the Quran for relevant verses.",
                },
              },
              required: ["question"],
            },
          },
        ],
        input_audio_transcription: {
          model: "whisper-1",
        },
      },
    };
    dataChannel.send(JSON.stringify(sessionUpdate));
  }, []);

  // Get ephemeral token
  const getEphemeralToken = useCallback(async () => {
    try {
      const response = await fetch("/speak/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to get ephemeral token: ${response.status}`);
      }
      const data = await response.json();
      return data.client_secret.value;
    } catch (err) {
      console.error("getEphemeralToken error:", err);
      throw err;
    }
  }, []);

  // Start session
  const startSession = useCallback(async () => {
    try {
      setStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Setup audio visualization for user microphone
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      audioContextRef.current = audioContext;
      analyserRef.current = analyzer;

      // Start monitoring user's microphone volume
      volumeIntervalRef.current = window.setInterval(() => {
        setCurrentVolume(getVolume());
      }, 100);

      setStatus("Fetching session token...");
      const ephemeralToken = await getEphemeralToken();

      setStatus("Establishing connection...");
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Hidden audio element for assistant TTS
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      // Inbound track (assistant voice)
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      // Data channel for transcripts
      const dataChannel = pc.createDataChannel("response");
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        configureDataChannel(dataChannel);
      };
      dataChannel.onmessage = handleDataChannelMessage;

      // Add local track
      pc.addTrack(stream.getTracks()[0]);

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Exchange SDP with OpenAI
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const response = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp",
        },
      });

      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsSessionActive(true);
      setStatus("Connected");
    } catch (err) {
      console.error("startSession error:", err);
      setStatus(`Error: ${err}`);
      stopSession();
    }
  }, [getEphemeralToken, configureDataChannel, handleDataChannelMessage, getVolume]);

  // Stop session
  const stopSession = useCallback(() => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    analyserRef.current = null;
    ephemeralUserMessageIdRef.current = null;

    setCurrentVolume(0);
    setIsSessionActive(false);
    setStatus("");
  }, []);

  // Toggle start/stop
  const handleStartStopClick = useCallback(() => {
    if (isSessionActive) {
      stopSession();
    } else {
      startSession();
    }
  }, [isSessionActive, startSession, stopSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return {
    status,
    isSessionActive,
    currentVolume,
    conversation,
    handleStartStopClick,
  };
}
