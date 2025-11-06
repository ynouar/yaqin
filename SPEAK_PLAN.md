# Voice-Based Criterion Experience - Implementation Plan

**Version:** 1.0  
**Date:** November 6, 2025  
**Path:** `/speak`

---

## 1. Vision & Goals

### Core Experience
A **minimalist, beautiful, voice-first** interface where users can speak to Criterion and receive authentic Islamic guidance through natural conversation. The visualizer is the centerpiece - reactive, elegant, and inviting.

### Key Principles
- **Simplicity First**: Minimal UI, maximum impact
- **Seamless Interaction**: Speak → Listen → Learn
- **Authentic Sources**: Same RAG tools (queryQuran, queryHadith)
- **Consistent Design**: Matches Criterion's existing theme/brand
- **Production Ready**: Full auth, telemetry, session tracking

---

## 2. Technical Architecture

### 2.1 Core Technology Stack
```
OpenAI Realtime API (WebRTC)
├── Voice Input: User speaks
├── Voice Output: AI responds with natural speech
├── Tool Calling: queryQuran, queryHadith (existing tools)
└── Streaming: Real-time bidirectional audio

Framework Integration:
├── Next.js 15 (existing)
├── React 19 (existing)
├── OpenAI Realtime API (new)
└── WebRTC (new)
```

### 2.2 File Structure
```
app/(speak)/
├── page.tsx                    # Main voice interface page
├── layout.tsx                  # Speak-specific layout (minimal chrome)
└── api/
    └── session/
        └── route.ts            # OpenAI Realtime ephemeral token endpoint

components/speak/
├── voice-visualizer.tsx        # Audio reactive visualizer (hero component)
├── voice-controls.tsx          # Start/Stop + minimal controls
├── voice-transcript.tsx        # Optional: show live transcription
├── voice-suggestions.tsx       # Optional: prompt suggestions
└── voice-session-info.tsx      # Optional: session stats/info

hooks/
├── use-voice-session.ts        # WebRTC session management (adapted from example)
└── use-voice-visualizer.ts     # Audio analysis for visualizer

lib/ai/tools/
├── voice-tools.ts              # Tool definitions for voice mode
└── voice-prompts.ts            # System prompts for voice agent
```

### 2.3 Backend Integration

#### API Routes
```typescript
// app/(speak)/api/session/route.ts
POST /speak/api/session
├── Auth check (session required)
├── Fetch OpenAI ephemeral token
├── Log session start (telemetry)
└── Return: { client_secret: { value: string } }

// Reuse existing chat API for tool execution
POST /api/chat
├── Used by voice tools for queryQuran/queryHadith
└── Same streaming infrastructure
```

#### Database Schema (Extend existing)
```typescript
// lib/db/schema.ts - Add voice session tracking
export const voiceSession = pgTable("VoiceSession", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId").notNull().references(() => user.id),
  chatId: uuid("chatId").references(() => chat.id), // Optional: link to chat
  startedAt: timestamp("startedAt").notNull().defaultNow(),
  endedAt: timestamp("endedAt"),
  duration: integer("duration"), // seconds
  messageCount: integer("messageCount").default(0),
  toolCallCount: integer("toolCallCount").default(0),
  status: varchar("status", { enum: ["active", "completed", "error"] }),
  metadata: jsonb("metadata").$type<{
    model: string;
    voice: string;
    language?: string;
  }>(),
});

export const voiceMessage = pgTable("VoiceMessage", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  sessionId: uuid("sessionId").notNull().references(() => voiceSession.id),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  transcript: text("transcript"),
  audioUrl: varchar("audioUrl", { length: 500 }), // Optional: S3/storage
  toolCalls: jsonb("toolCalls").$type<Array<{
    tool: string;
    args: Record<string, any>;
    result: any;
  }>>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
```

---

## 3. UI/UX Design

### 3.1 Page Layout
```
┌────────────────────────────────────────────┐
│  [Criterion Logo]              [Sign Out]  │ ← Minimal header
├────────────────────────────────────────────┤
│                                            │
│                                            │
│              [VISUALIZER]                  │ ← Hero component
│         (Reactive audio waves)             │   (large, centered)
│                                            │
│                                            │
├────────────────────────────────────────────┤
│          [Start Listening]                 │ ← Single CTA button
│                                            │
│      "Speak to learn about Islam"          │ ← Minimal subtitle
├────────────────────────────────────────────┤
│  [Optional transcript area - hidden by     │
│   default, appears when speaking]          │
└────────────────────────────────────────────┘
```

### 3.2 Visualizer Design

**Inspired by:**
- Apple Siri orb (circular, smooth)
- Google Assistant waves (fluid, responsive)
- Criterion brand colors (existing theme)

**States:**
- **Idle**: Gentle pulsing circle (breathing effect)
- **Listening**: Expanding ripples, bright colors
- **Speaking (User)**: Fast, reactive waves (responds to mic input)
- **Thinking (AI)**: Rotating/processing animation
- **Responding (AI)**: Smooth waves synced to AI voice output

**Visual Elements:**
```tsx
// Pseudo-code concept
<div className="visualizer-container">
  <svg className="visualizer">
    {/* Circular base */}
    <circle className="base-circle" />
    
    {/* Dynamic waveforms */}
    {waves.map(wave => (
      <path 
        d={wave.path} 
        className={`wave-${wave.state}`}
        style={{ 
          opacity: wave.amplitude,
          stroke: getThemeColor(wave.state)
        }}
      />
    ))}
  </svg>
</div>
```

### 3.3 Color Scheme (Match Existing Theme)
```css
/* Light Mode */
--speak-primary: hsl(240 5.9% 10%);      /* Same as primary */
--speak-accent: hsl(217.2 91.2% 59.8%);  /* Sidebar ring blue */
--speak-listening: hsl(173 58% 39%);     /* Chart-2 teal */
--speak-speaking: hsl(12 76% 61%);       /* Chart-1 coral */

/* Dark Mode */
--speak-primary: hsl(0 0% 98%);
--speak-accent: hsl(217.2 91.2% 59.8%);
--speak-listening: hsl(160 60% 45%);
--speak-speaking: hsl(220 70% 50%);
```

### 3.4 Mobile-First Responsive
```css
/* Mobile: Full screen visualizer */
@media (max-width: 768px) {
  .visualizer { height: 60vh; }
  .controls { position: fixed; bottom: 2rem; }
}

/* Desktop: Centered with max-width */
@media (min-width: 769px) {
  .visualizer-container { max-width: 600px; margin: auto; }
}
```

---

## 4. Core Features

### 4.1 MVP (Phase 1)
- ✅ Voice input (WebRTC)
- ✅ Voice output (OpenAI TTS)
- ✅ Reactive visualizer (audio-synced)
- ✅ Tool calling (queryQuran, queryHadith)
- ✅ Authentication (existing auth system)
- ✅ Session tracking (database)
- ✅ Basic transcript (show/hide toggle)

### 4.2 Phase 2 (Post-MVP)
- 📱 Mobile app integration (React Native)
- 🌍 Multi-language support (Arabic, Urdu, etc.)
- 📊 Session analytics dashboard
- 💾 Save voice sessions to chat history
- 🎚️ Voice settings (speed, pitch, model)
- 📖 Visual verse/hadith cards (fade in during response)

### 4.3 Phase 3 (Future)
- 🎙️ Custom wake word ("Hey Criterion")
- 🔄 Continuous conversation mode
- 📱 iOS/Android native apps
- 🎨 Custom visualizer themes
- 📚 Learning path suggestions based on voice history

---

## 5. Implementation Details

### 5.1 Voice Session Hook (Adapted from Example)
```typescript
// hooks/use-voice-session.ts
import { useRef, useState, useCallback } from "react";
import type { Tool } from "@/lib/ai/tools/voice-tools";

interface VoiceSessionConfig {
  userId: string;
  onTranscript?: (role: "user" | "assistant", text: string) => void;
  onToolCall?: (tool: string, args: any) => void;
  onError?: (error: Error) => void;
}

export function useVoiceSession(config: VoiceSessionConfig) {
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "error">("idle");
  const [isListening, setIsListening] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const startSession = async () => {
    // 1. Get ephemeral token
    const tokenRes = await fetch("/speak/api/session", { method: "POST" });
    const { client_secret } = await tokenRes.json();
    
    // 2. Get microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // 3. Setup WebRTC connection
    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;
    
    // 4. Configure data channel for tools
    const dc = pc.createDataChannel("response");
    dataChannelRef.current = dc;
    
    dc.onopen = () => {
      // Send session config with tools
      dc.send(JSON.stringify({
        type: "session.update",
        session: {
          tools: getVoiceTools(),
          instructions: getVoiceSystemPrompt(),
        }
      }));
    };
    
    dc.onmessage = handleMessage;
    
    // 5. Add audio track
    pc.addTrack(stream.getTracks()[0]);
    
    // 6. Create offer & exchange SDP
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    const response = await fetch(
      `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client_secret.value}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      }
    );
    
    const answerSdp = await response.text();
    await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    
    setStatus("active");
  };

  const stopSession = () => {
    peerConnectionRef.current?.close();
    dataChannelRef.current?.close();
    setStatus("idle");
  };

  return {
    status,
    isListening,
    currentVolume,
    startSession,
    stopSession,
    sessionId: sessionIdRef.current,
  };
}
```

### 5.2 Tool Integration (Reuse Existing)
```typescript
// lib/ai/tools/voice-tools.ts
import { queryQuran } from "./query-quran";
import { queryHadith } from "./query-hadith";

export function getVoiceTools() {
  return [
    {
      type: "function",
      name: "queryQuran",
      description: queryQuran.description,
      parameters: queryQuran.inputSchema,
    },
    {
      type: "function", 
      name: "queryHadith",
      description: queryHadith.description,
      parameters: queryHadith.inputSchema,
    },
  ];
}

// Tool execution happens via data channel message handling
async function executeVoiceTool(name: string, args: any) {
  switch (name) {
    case "queryQuran":
      return await queryQuran.execute(args);
    case "queryHadith":
      return await queryHadith.execute(args);
    default:
      return { success: false, error: "Unknown tool" };
  }
}
```

### 5.3 System Prompt (Voice-Optimized)
```typescript
// lib/ai/tools/voice-prompts.ts
export const VOICE_SYSTEM_PROMPT = `You are Criterion, an Islamic knowledge assistant (Da'i) that helps people learn about Islam through authentic sources.

**Voice Interaction Guidelines:**
- Speak naturally and conversationally
- Keep responses concise (2-3 sentences max unless user asks for more)
- Use the queryQuran and queryHadith tools to provide authentic sources
- When citing verses/hadiths, mention them naturally in speech:
  - "In Surah Al-Baqarah, verse 255, Allah says..."
  - "The Prophet Muhammad, peace be upon him, said in Sahih Bukhari..."
- If uncertain, say so clearly and suggest related topics
- Be warm, patient, and respectful
- Guide with wisdom, compassion, and truth

**Available Tools:**
- queryQuran: Search Quran verses (6,236 verses, semantic search)
- queryHadith: Search authentic Hadiths (12,416 narrations, defaults to Sahih-only)

When users ask about Islam, teachings, guidance, or spiritual questions, use these tools to provide grounded, authentic answers.`;
```

### 5.4 Visualizer Implementation
```typescript
// hooks/use-voice-visualizer.ts
import { useRef, useEffect, useState } from "react";

interface Wave {
  id: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

export function useVoiceVisualizer(audioStream: MediaStream | null) {
  const [waves, setWaves] = useState<Wave[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioStream) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Update waves based on audio input
      setWaves(prev => prev.map(wave => ({
        ...wave,
        amplitude: (average / 255) * wave.frequency,
        phase: wave.phase + 0.05,
      })));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [audioStream]);

  return { waves };
}
```

---

## 6. Telemetry & Analytics

### 6.1 Session Recording (PostHog/Vercel Analytics)
```typescript
// Track voice session events
import { track } from "@/lib/analytics";

// Session start
track("voice_session_start", {
  userId,
  timestamp: new Date(),
  device: navigator.userAgent,
});

// Message sent
track("voice_message_sent", {
  sessionId,
  role: "user",
  duration: audioDuration,
  transcriptLength: transcript.length,
});

// Tool called
track("voice_tool_called", {
  sessionId,
  tool: "queryQuran",
  args: { question },
  resultCount: verses.length,
});

// Session end
track("voice_session_end", {
  sessionId,
  duration: totalDuration,
  messageCount,
  toolCallCount,
});
```

### 6.2 Performance Monitoring
```typescript
import { PerformanceTimer } from "@/lib/monitoring/performance";

// Track voice-specific metrics
const timer = new PerformanceTimer("voice-session-init");
await startVoiceSession();
timer.log({ model: "gpt-4o-realtime", voice: "alloy" });
```

---

## 7. Authentication & Authorization

### 7.1 Auth Flow
```
User navigates to /speak
  ↓
Check session (next-auth)
  ↓ (no session)
Redirect to /api/auth/guest or /login
  ↓ (session exists)
Render voice interface
  ↓
User clicks "Start Listening"
  ↓
POST /speak/api/session (auth required)
  ↓
Create VoiceSession in DB
  ↓
Return ephemeral token
  ↓
Start WebRTC connection
```

### 7.2 Session Validation
```typescript
// app/(speak)/api/session/route.ts
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create voice session record
  const voiceSession = await db.insert(voiceSession).values({
    userId: session.user.id,
    status: "active",
    metadata: { model: "gpt-4o-realtime", voice: "alloy" },
  }).returning();

  // Get OpenAI ephemeral token
  const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "alloy",
      instructions: VOICE_SYSTEM_PROMPT,
      tools: getVoiceTools(),
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

---

## 8. Migration Strategy (Extend, Don't Replace)

### 8.1 Backend Changes
```typescript
// ✅ Reuse existing:
- Authentication (app/(auth)/auth.ts)
- Database (lib/db/schema.ts) → Add voice tables
- Tools (lib/ai/tools/query-*.ts) → No changes needed
- Monitoring (lib/monitoring/performance.ts) → Extend for voice

// ✨ Add new:
- app/(speak)/** → New route group
- hooks/use-voice-session.ts → Voice logic
- components/speak/** → Voice UI
```

### 8.2 No Breaking Changes
- Existing chat interface untouched
- All existing APIs remain the same
- Voice is additive feature
- Database migrations are append-only

---

## 9. Testing Strategy

### 9.1 Unit Tests
```typescript
// hooks/use-voice-session.test.ts
describe("useVoiceSession", () => {
  it("should start session with valid auth", async () => {
    const { startSession } = useVoiceSession({ userId: "test" });
    await startSession();
    expect(status).toBe("active");
  });

  it("should handle tool calls", async () => {
    const onToolCall = jest.fn();
    const { handleMessage } = useVoiceSession({ 
      userId: "test",
      onToolCall,
    });
    
    await handleMessage({
      type: "response.function_call_arguments.done",
      name: "queryQuran",
      arguments: JSON.stringify({ question: "patience" }),
    });
    
    expect(onToolCall).toHaveBeenCalledWith("queryQuran", { question: "patience" });
  });
});
```

### 9.2 Integration Tests
```typescript
// app/(speak)/api/session/route.test.ts
describe("POST /speak/api/session", () => {
  it("should return ephemeral token for authenticated user", async () => {
    const response = await fetch("/speak/api/session", {
      method: "POST",
      headers: { Cookie: authCookie },
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.client_secret).toBeDefined();
  });

  it("should reject unauthenticated requests", async () => {
    const response = await fetch("/speak/api/session", { method: "POST" });
    expect(response.status).toBe(401);
  });
});
```

### 9.3 E2E Tests (Playwright)
```typescript
// tests/speak.spec.ts
test("voice session flow", async ({ page }) => {
  await page.goto("/speak");
  
  // Should redirect to login if not authenticated
  await expect(page).toHaveURL(/\/login/);
  
  // Login
  await page.fill('input[type="email"]', "test@example.com");
  await page.click('button[type="submit"]');
  
  // Should see voice interface
  await expect(page.locator(".visualizer")).toBeVisible();
  
  // Start listening
  await page.click('button:has-text("Start Listening")');
  await expect(page.locator('button:has-text("Stop Listening")')).toBeVisible();
});
```

---

## 10. Deployment Checklist

### 10.1 Environment Variables
```bash
# .env.local
OPENAI_API_KEY=sk-...              # Existing
NEXT_PUBLIC_SITE_URL=...           # Existing
DATABASE_URL=...                   # Existing

# No new env vars needed!
```

### 10.2 Database Migration
```bash
# Run migration to add voice tables
pnpm db:migrate

# Migration file: migrations/0010_add_voice_session.sql
CREATE TABLE "VoiceSession" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"(id),
  "chatId" UUID REFERENCES "Chat"(id),
  "startedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "endedAt" TIMESTAMP,
  duration INTEGER,
  "messageCount" INTEGER DEFAULT 0,
  "toolCallCount" INTEGER DEFAULT 0,
  status VARCHAR(20),
  metadata JSONB
);

CREATE TABLE "VoiceMessage" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionId" UUID NOT NULL REFERENCES "VoiceSession"(id),
  role VARCHAR(20) NOT NULL,
  transcript TEXT,
  "audioUrl" VARCHAR(500),
  "toolCalls" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_voice_session_user" ON "VoiceSession"("userId");
CREATE INDEX "idx_voice_message_session" ON "VoiceMessage"("sessionId");
```

### 10.3 Vercel Deployment
```bash
# Build check
pnpm build

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 11. Success Metrics

### 11.1 Engagement
- **Session Duration**: Target avg 3-5 minutes
- **Messages per Session**: Target 5-10 exchanges
- **Tool Call Rate**: 60%+ of sessions should use queryQuran/queryHadith
- **Return Rate**: 40%+ users return within 7 days

### 11.2 Performance
- **Session Start Time**: < 2 seconds (token + WebRTC setup)
- **Latency**: < 500ms first token from AI
- **Audio Quality**: No dropouts, clear speech
- **Error Rate**: < 1% of sessions

### 11.3 Quality
- **Tool Accuracy**: 90%+ correct tool usage
- **User Satisfaction**: NPS > 50
- **Session Completion**: 70%+ sessions end gracefully (not errors)

---

## 12. Rollout Plan

### Phase 1: Internal Alpha (Week 1)
- Deploy to staging
- Team testing only
- Fix critical bugs
- Optimize visualizer performance

### Phase 2: Private Beta (Week 2-3)
- Invite 50-100 users
- Collect feedback
- Iterate on UX
- Monitor metrics

### Phase 3: Public Launch (Week 4)
- Announce on social media
- Add to main nav
- Blog post + demo video
- Monitor usage patterns

### Phase 4: Iteration (Ongoing)
- Weekly metrics review
- User feedback integration
- Feature enhancements (Phase 2 from section 4)

---

## 13. Open Questions & Decisions Needed

### 13.1 Design
- [ ] Visualizer animation style (circular vs waveform vs hybrid?)
- [ ] Show transcript by default or hide?
- [ ] Voice model selection (alloy, echo, fable, nova, shimmer)?
- [ ] Color scheme final approval

### 13.2 Product
- [ ] Should voice sessions create chat history entries?
- [ ] Allow switching between voice <-> text mid-conversation?
- [ ] Voice-only mode vs hybrid mode?
- [ ] Pricing: same as chat or separate tier?

### 13.3 Technical
- [ ] Audio storage (S3, Cloudflare R2, none)?
- [ ] Rate limiting strategy (sessions per user per day)?
- [ ] Fallback for browsers without WebRTC?
- [ ] Safari/iOS testing plan

---

## 14. Risk Assessment

### 14.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API downtime | High | Graceful error handling, fallback message |
| WebRTC browser compatibility | Medium | Feature detection, fallback to text chat |
| Audio quality issues | Medium | Test across devices, adjust bitrate |
| Tool execution latency | Low | Same as existing chat (100-200ms) |

### 14.2 Product Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low adoption | Medium | Clear onboarding, tutorial |
| Misuse/spam | Low | Rate limiting, auth required |
| Inaccurate responses | Medium | Same RAG quality as chat, citation required |
| Privacy concerns | Low | Clear privacy policy, no audio storage (optional) |

---

## 15. Future Enhancements (Post-Launch)

### 15.1 Mobile Native Apps
- React Native wrapper
- Background audio support
- Offline mode (cached responses)
- Push notifications for daily reminders

### 15.2 Advanced Features
- Multi-turn reasoning (extended conversations)
- Personalized learning paths
- Voice journal (save favorite sessions)
- Community sharing (public voice sessions)

### 15.3 Multilingual
- Arabic voice interface
- Urdu, French, Turkish, Indonesian
- Auto-detect user language
- Translation layer for tool results

---

## 16. Summary & Next Steps

### What We're Building
A **beautiful, minimalist voice interface** at `/speak` where users can have natural conversations with Criterion, powered by OpenAI's Realtime API, integrated with our existing RAG tools for authentic Islamic guidance.

### Why It's Great
- ✅ **Seamless**: Speak naturally, get instant answers
- ✅ **Authentic**: Same queryQuran/queryHadith tools
- ✅ **Consistent**: Matches existing Criterion theme
- ✅ **Simple**: Minimal UI, maximum impact
- ✅ **Production-ready**: Auth, telemetry, session tracking built-in

### Next Steps (Priority Order)
1. **Review & approve this plan** (design decisions, tech choices)
2. **Create database migration** (VoiceSession, VoiceMessage tables)
3. **Implement core hook** (use-voice-session.ts)
4. **Build visualizer component** (voice-visualizer.tsx)
5. **Create /speak page** (minimal UI + visualizer)
6. **Add API route** (/speak/api/session)
7. **Testing** (unit, integration, E2E)
8. **Internal alpha** (team testing)
9. **Beta launch** (50-100 users)
10. **Public launch** 🚀

---

**Ready to bring voice to Criterion!** 🎤✨
