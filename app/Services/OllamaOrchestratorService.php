<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OllamaOrchestratorService
{
    protected string $baseUrl;

    public function __construct()
    {
        // Host 'ollama' is defined in docker-compose.yml. 
        // We use port 11434 which is the default for Ollama APIs.
        $this->baseUrl = env('OLLAMA_URL', 'http://ollama:11434/api');
    }

    /**
     * Sends a prompt to a specific local model via Ollama.
     */
    public function generateResponse(string $prompt, string $model = 'mistral')
    {
        try {
            // High timeout for local models processing heavy tasks
            $response = Http::timeout(120)->post("{$this->baseUrl}/generate", [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false, // We wait for the full response to deliver to the mobile app
            ]);

            if ($response->successful()) {
                return $response->json('response');
            }

            Log::error("Ollama API Error: " . $response->body());
            return "Error interacting with local agent: " . $model;
            
        } catch (\Exception $e) {
            Log::error("Ollama Exception: " . $e->getMessage());
            return "Connection error to local agent. Please ensure the Ollama container is running and the model is downloaded.";
        }
    }

    /**
     * Orchestrates which model to use based on the task description.
     * This saves cloud token costs by routing tasks to local open-source models.
     */
    public function orchestrateTask(string $taskType, string $input)
    {
        // 1. Selector de Agente Local:
        // Tareas lógicas, estructuración de datos pesados o código -> DeepSeek
        // Tareas de chat, redacción, resúmenes -> Mistral
        $model = match ($taskType) {
            'logic', 'data_extraction', 'analysis' => 'deepseek-coder',
            'chat', 'summary', 'assistant' => 'mistral',
            default => 'mistral',
        };

        // 2. Construcción del Prompt del Orquestador
        $prompt = "Actúa como un experto del sistema Kconecta CRM.\n";
        $prompt .= "Estás procesando para una App móvil. Responde de forma clara y directa.\n\n";
        $prompt .= "Contexto de tarea: {$taskType}\n";
        $prompt .= "Input del usuario: {$input}\n\n";
        $prompt .= "Respuesta requerida:";

        // 3. Ejecución descentralizada (sin gastar tokens externos)
        return [
            'model' => $model,
            'response' => $this->generateResponse($prompt, $model)
        ];
    }
}
