# Kconecta Mobile AI - Roadmap

## Phase 1 - Architecture & Smart Backend (Completed)
- [x] Dockerize existing Laravel application.
- [x] Integrate `ollama` service in `docker-compose.yml` with persistent volume.
- [x] Create `OllamaOrchestratorService` to route tasks to local agents (Mistral/DeepSeek).
- [x] Expose mobile-ready endpoints (`/api/agent/process`).
- [x] Setup continuous deployment with Dokploy.

## Phase 2 - Mobile App Initialization (Next step)
- [ ] Initialize React Native project using Expo (`npx create-expo-app`).
- [ ] Setup global state management (Zustand/Context API) and Expo Router.
- [ ] Configure Axios/Fetch to consume Laravel's API via local network IP.
- [ ] Implement user authentication UI (communicating with Laravel Sanctum).
- [ ] Build the Chat/Assistant UI to interact with the local AI.

## Phase 3 - App Capabilities & Logic
- [ ] Consume standard CRM endpoints (properties, services, maps).
- [ ] Refine AI prompts for specific CRM tasks (summarizing properties, drafting emails).
- [ ] Ensure mobile UI handles agent streaming or loading states smoothly.

## Phase 4 - Cloud & Store Deployment
- [ ] Setup `eas.json` for Expo Application Services (EAS).
- [ ] Configure signing credentials for Android (Keystore) and iOS (Certificates).
- [ ] Run `eas build --platform android --profile production` to generate `.aab`.
- [ ] Submit `.aab` to Google Play Console.
- [ ] Process App Store submission via Transporter / EAS Submit.
