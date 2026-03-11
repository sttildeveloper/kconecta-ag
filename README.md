# Kconecta CRM
Backend migration powering a new AI-integrated mobile application.

## Stack
- **Backend:** Laravel 12, PHP 8.2, MySQL 8
- **AI Engine:** Ollama (Mistral, DeepSeek)
- **Mobile App:** React Native, Expo, EAS (to be implemented)
- **Infrastructure:** Docker Compose (Local), Dokploy (Production)

## Local Run

To start the full environment (including the AI engine):
```powershell
docker compose -p kconecta up -d --build
```

### Initializing AI Models
On a fresh machine, you must download the AI models into the Ollama container:
```powershell
docker exec -it kconecta-ollama ollama run mistral
docker exec -it kconecta-ollama ollama run deepseek-coder
```

App local URLs:
- Backend: `http://localhost:8010`
- AI API: `http://localhost:11434`

## API Endpoints
The backend provides standard CRM endpoints and an AI orchestrator:
- `POST /api/agent/process` -> Delegates tasks to local Mistral/DeepSeek models based on complexity, saving cloud tokens.

## Deployment
Automated via Dokploy linked to the `main` branch. 
- Ensure Dokploy uses `.` as the Docker Context Path.
- The `Dockerfile` handles a multi-stage build (Node for Vite assets -> PHP/Apache for the app).

## Documentation
- Work instructions: [agent.md](./agent.md)
- Project phases: [roadmap.md](./roadmap.md)
- To-do list: [tasks.md](./tasks.md)
