# Kconecta CRM - Agent & Mobile AI Orchestration

## Goal
Evolve `kconecta-ag` into a modern backend that serves a native mobile app (built with React Native and EAS Expo) and integrates local AI agents (Ollama: Mistral & DeepSeek) to optimize token costs and perform smart tasks.

## Tomorrow's Workflow (Office PC)

When you arrive at the office, follow these exact steps to resume work:

1. **Pull the Latest Code:**
   Open a terminal in your workspace and clone/pull the repository:
   ```powershell
   git clone https://github.com/digitalbitsolutions/kconecta-ag.git .
   # OR if the folder already exists:
   git pull origin main
   ```

2. **Start the Docker Environment:**
   Start your backend (Laravel), database (MySQL), and the AI Engine (Ollama):
   ```powershell
   docker compose -p kconecta up -d --build
   ```

3. **Download Local AI Models (Only needed once per PC):**
   Since LLM weights are huge, they are not stored in GitHub. Download them directly into your local Ollama container:
   ```powershell
   docker exec -it kconecta-ollama ollama run mistral
   docker exec -it kconecta-ollama ollama run deepseek-coder
   ```
   *Tip: You can use `CTRL+D` or type `/bye` to exit the Ollama prompt once downloaded.*

4. **Verify Backend AI:**
   The orchestrator is ready at `app/Services/OllamaOrchestratorService.php`. It listens at `POST /api/agent/process`.

5. **Start Mobile App Development:**
   Initialize your React Native app using Expo in a new directory or alongside this one to start consuming the Laravel API.

## Hardware Acceleration (Optional)
If your office or home PC has an Nvidia GPU, edit `docker-compose.yml`, uncomment the `deploy > resources > reservations > devices` block under the `ollama` service, and restart the containers. This will make AI responses lightning fast.
