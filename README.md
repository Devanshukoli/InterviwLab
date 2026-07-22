# InterviewOps 🔬
> **AI-Powered Technical Interview Simulator & Observability Platform**

InterviewOps is an enterprise-grade technical interview preparation platform built specifically for Systems Engineers, Site Reliability Engineers (SREs), and Software Architects. By evaluating a candidate's resume against specific Job Descriptions (JDs), InterviewOps deploys a multi-agent AI pipeline to generate targeted technical scenarios, evaluate answers against architectural best practices, and trace every pipeline step with full OpenTelemetry instrumentation.

---

## 🎯 Introduction

### What is InterviewOps all about?
InterviewOps bridges the gap between passive interview study and active, scenario-based technical evaluations. It reads uploaded resumes and job descriptions, parses technical requirements, constructs customized scenario questions (system design, troubleshooting, behavioral, and domain deep dives), evaluates candidate responses in real-time, and generates structured coaching reports. Crucially, the entire system is built like an enterprise production microservice, complete with open telemetry tracing and Supabase persistence.

### Why should you take a look at this project?
Unlike typical tutorial projects or simple wrapper UI applications, InterviewOps demonstrates **full-stack engineering rigor**:
- **Production Architecture**: Strict separation of concerns (Controllers, Services, Models, Routes) using Express and TypeScript.
- **Observability-First**: Built-in OpenTelemetry instrumentation (`@opentelemetry/sdk-node`) capturing trace spans across agent execution steps.
- **Enterprise Storage**: Full SQL schema, indexes, triggers, and Row Level Security (RLS) designed for Supabase PostgreSQL (`/sql`).
- **Resilient AI Pipeline**: Abstracted Google Gemini API integration using `@google/genai`.

### How is it useful for interview preparation compared to other platforms?
1. **JD-Matched Context**: Most platforms ask generic LeetCode or canned questions. InterviewOps matches your real resume against a specific target Job Description to simulate the exact interviews companies will run.
2. **Deep Architectural Scenarios**: Questions probe system design trade-offs, fault tolerance, distributed tracing, and real production incidents rather than basic syntax trivia.
3. **Instant Actionable Feedback**: Answers are evaluated against missing technical concepts, clarity ratings, and architectural completeness with concrete suggestions for improvement.
4. **Learning Metric Trackers**: Automatically updates a confidence heat map across technical topics (e.g., OpenTelemetry, System Design, Node.js Concurrency) so you know exactly where your gaps are.

### By checking the code, what will you be able to study/learn yourself?
- **Modular Monolith Express Pattern**: How to organize clean, maintainable backend Express code into modular feature domains (`/server/api/*`).
- **OpenTelemetry Span Propagation**: How to instrument custom tracing spans across backend service workflows and surface telemetry logs via `/api/telemetry`.
- **Database Architecture & SQL RLS**: How to structure PostgreSQL schemas (`/sql/01_schema.sql`), secure user tables with Supabase Row Level Security (`/sql/02_rls_policies.sql`), and maintain a unified repository fallback pattern (`/server/db.ts`).
- **Modern React 19 UI & Single-View Workflows**: How to construct sleek, high-contrast dark interfaces using React 19, Tailwind CSS, and Lucide Icons with zero clutter.

---

## 📋 Prerequisites

To run and inspect InterviewOps locally, ensure you have the following installed:

- **Node.js**: `v18.x` or `v20.x` (or `v22.x`)
- **Package Manager**: `npm` (v9+) or `bun` / `yarn` / `pnpm`
- **Google Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/) for AI generation.
- **Supabase Account / Local CLI** *(Optional for cloud DB)*: For running production PostgreSQL schemas (`sql/01_schema.sql`).
- **OTLP Telemetry Collector** *(Optional)*: SigNoz, Jaeger, or Datadog listening on `http://localhost:4318` for OpenTelemetry trace export.

---

## ⚡ Quick Start Guide

Follow these step-by-step instructions to get InterviewOps running locally:

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-org/interviewops.git
cd interviewops

# Install npm dependencies
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the project root by copying `.env.example`:
```bash
cp .env.example .env
```

Ensure your `.env` contains the required keys:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Optional for production cloud DB)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenTelemetry Exporter Endpoint
OTEL_SERVICE_NAME=interviewops-api
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

### Step 3: Database Setup (Supabase / PostgreSQL)
If using Supabase:
1. Navigate to your **Supabase Dashboard** -> **SQL Editor**.
2. Run `/sql/01_schema.sql` to instantiate all schema tables, enums, constraints, and indexes.
3. Run `/sql/02_rls_policies.sql` to enable Row Level Security policies and auth triggers.
4. (Optional) Run `/sql/03_seed_data.sql` if you wish to pre-populate database tables.

### Step 4: Launch Development Server
```bash
# Starts Express backend and Vite middleware concurrently on http://localhost:3000
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 5: Production Build & Run
To test the production bundled build:
```bash
# Compiles Vite static assets & bundles backend server into dist/server.cjs
npm run build

# Start production Node server
npm run start
```

---

## ⚠️ Known Gaps & Limitations

To scale InterviewOps into a world-class platform capable of handling millions of concurrent engineers, the following production architecture gaps must be addressed:

- 🚨 **Synchronous LLM Lifecycle (Queue Gap)**: Evaluation requests currently execute synchronously within the Express HTTP request-response cycle. At scale, LLM API latency spikes can exhaust Express worker connections. *Fix needed: Introduce BullMQ/RabbitMQ worker queues with asynchronous job processing.*
- 🚨 **In-Memory Cache & Session State**: Active interview sessions reside in memory with fallback capability. To support horizontal scaling across multiple container pods, state must be backed by a distributed Redis cluster (`ioredis`).
- 🚨 **Streaming Response / Voice WebSockets**: Questions and answers currently use REST JSON requests. A world-class simulator requires Server-Sent Events (SSE) or WebSockets (`ws`) for real-time streaming audio and live voice interview simulation.
- 🚨 **Distributed Rate Limiting**: The current rate-limiting layer is simulated in Express middleware. A distributed Redis-backed Token Bucket rate-limiter is required to prevent API key abuse under traffic spikes.
- 🚨 **Database Connection Pooling**: Direct Supabase client queries require Supavisor / pgBouncer connection pooling to handle high-concurrency database spikes.
- 🚨 **Automated E2E Test Suite**: Needs comprehensive Playwright/Cypress end-to-end user journey tests and Vitest unit testing for AI agent outputs.

---

## 🔍 Troubleshooting Guide

Follow these step-by-step procedures when debugging issues or performance bottlenecks:

### 1. Application & Server Boot Issues
- **Error**: `PORT 3000 in use` or server fails to bind.
  - **Check**: Verify if another process is running on port 3000 (`lsof -i :3000` or `netstat -ano | grep 3000`). Kill stale processes or update `PORT` in `.env`.
- **Error**: `GEMINI_API_KEY environment variable is required`.
  - **Check**: Confirm `.env` exists in the project root and `GEMINI_API_KEY` is set without quotes.

### 2. Inspecting API Requests & Responses
- All API routes are prefixed under `/api`:
  - `POST /api/auth/login` - User login
  - `POST /api/interview/upload-resume` - Resume ingestion & skill parsing
  - `POST /api/interview/generate-questions` - Question generation agent
  - `POST /api/interview/evaluate` - Answer grading agent
  - `GET /api/telemetry` - Internal OpenTelemetry trace buffer dump

### 3. OpenTelemetry, Latency & Trace Debugging
- **Viewing Spans**: Query `http://localhost:3000/api/telemetry` in your browser or Postman to view buffered OpenTelemetry trace records, agent execution spans, and latency durations.
- **Collector Endpoint**: If using SigNoz or Jaeger, verify the collector is receiving OTLP spans at `http://localhost:4318/v1/traces`. If the collector is offline, the SDK logs a graceful warning without crashing the app.

### 4. Database & RLS Permissions
- **Error**: `42501 (new row violates row-level security policy)`.
  - **Check**: Ensure `sql/02_rls_policies.sql` was executed in Supabase and that valid JWT authentication headers are being passed with requests.

---

## 💬 Architectural Review & Questions

### Critique of Current System State
1. **Strengths**: The repository demonstrates exceptional backend modularity with clean router-controller-service separation (`/server/api`), strict schema types (`/server/db.ts`), OpenTelemetry observability, and a crisp, responsive UI.
2. **Growth Opportunities**: Transitioning the LLM generation flow from synchronous HTTP calls to an event-driven background worker pipeline (Redis + BullMQ) will unlock massive scalability and zero-timeout execution.

### Clarifying Questions for Future Enhancements
1. **Supabase Cloud Sync**: Would you like us to wire up direct live Supabase authentication providers (Google/GitHub OAuth) alongside the current fallback database?
2. **Audio/Voice Mode**: Shall we implement WebSockets / WebRTC streaming using Gemini Live API for real-time voice-based technical interviews?
3. **Distributed Caching**: Should we add a Redis caching tier (`ioredis`) for prompt versioning and session management?
