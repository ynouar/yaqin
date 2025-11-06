CREATE TABLE IF NOT EXISTS "VoiceMessage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" uuid NOT NULL,
	"role" varchar NOT NULL,
	"transcript" text,
	"toolCalls" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VoiceSession" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"endedAt" timestamp,
	"duration" integer,
	"messageCount" integer DEFAULT 0,
	"toolCallCount" integer DEFAULT 0,
	"status" varchar DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "VoiceMessage" ADD CONSTRAINT "VoiceMessage_sessionId_VoiceSession_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."VoiceSession"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "VoiceSession" ADD CONSTRAINT "VoiceSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_voice_message_session" ON "VoiceMessage" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_voice_session_user" ON "VoiceSession" USING btree ("userId");