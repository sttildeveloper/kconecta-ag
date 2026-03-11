<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OllamaOrchestratorService;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    protected OllamaOrchestratorService $orchestrator;

    public function __construct(OllamaOrchestratorService $orchestrator)
    {
        $this->orchestrator = $orchestrator;
    }

    /**
     * Endpoint for the Mobile App to delegate tasks to local agents.
     */
    public function processTask(Request $request)
    {
        $request->validate([
            'task_type' => 'required|string',
            'input' => 'required|string',
        ]);

        $taskType = $request->input('task_type');
        $input = $request->input('input');

        // Delegamos el trabajo pesado al orquestador que usa los modelos locales
        $result = $this->orchestrator->orchestrateTask($taskType, $input);

        return response()->json([
            'success' => true,
            'orchestrator_decision' => [
                'routed_to_model' => $result['model'],
                'cost' => '0 tokens (Local Execution)',
            ],
            'data' => $result['response'],
        ]);
    }
}
