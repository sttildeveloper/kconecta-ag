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
- [ ] Arrive at the office and run `git pull origin main`.
- [ ] Run `docker compose -p kconecta up -d --build`.
- [ ] Execute `docker exec -param kconecta-ollama ollama run mistral` to download local models.
- [ ] Test the `/api/agent/process` endpoint using Postman or cURL.
- [ ] Scaffold the React Native application using Expo.
- [ ] Set up the first communication test between the local Expo App and the local Laravel backend.
- [ ] Design the chatbot UI component to consume the Ollama Orchestrator.
