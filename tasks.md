# Kconecta CRM - Task Tracker

## Phase 1: AI & Mobile Readiness (Done Today 🚀)
- [x] Push current local codebase to new repository (`digitalbitsolutions/kconecta-ag.git`).
- [x] Integrate Dokploy deployments (Hostinger) connected to `main` branch.
- [x] Fix Dokploy deployment failure by adjusting Docker context path to `.`.
- [x] Update `docker-compose.yml` to include `ollama` local service and persistent data volumes.
- [x] Create Laravel `OllamaOrchestratorService` to act as an AI router.
- [x] Create Laravel `AgentController` handling the API Endpoint `/api/agent/process`.
- [x] Update `README.md`, `agent.md`, and `roadmap.md` with instructions for tomorrow's workflow.

## Phase 2: Mobile App Foundation (Pending for Tomorrow)
- [ ] **Configure Local Coder Agent**: Install Roo Code/Cline in VSCode and point it to local Ollama's `deepseek-coder` to zero out token usage.
- [ ] **CRITICAL FIX**: Troubleshoot why the Android emulator does not load the Expo app (White screen / crash issue), review Expo Router paths and layout setups.
- [ ] **GOAL**: Successfully render `LoginScreen.js` inside the Android Emulator and achieve a real login using Laravel Sanctum connection (`10.0.2.2:8010`).
- [ ] Arrive at the office and run `git pull origin main`.
- [ ] Run `docker compose -p kconecta up -d --build`.
- [ ] Execute `docker exec -param kconecta-ollama ollama run mistral` to download local models.
- [ ] Test the `/api/agent/process` endpoint using Postman or cURL.
- [x] Scaffold the React Native application using Expo.
- [x] Set up the first communication test between the local Expo App and the local Laravel backend.
- [x] Design the chatbot UI component to consume the Ollama Orchestrator.
