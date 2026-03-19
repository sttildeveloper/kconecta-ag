<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PropertyApiController extends Controller
{
    public function __construct()
    {
        // Usamos Sanctum y protegemos todos los métodos para que el usuario sea detectado correctamente
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $perPage = 15;
        $page = $request->input('page', 1);
        
        $properties = $user->properties()->paginate($perPage);
        
        return response()->json([
            'data' => $properties->items(),
            'meta' => [
                'current_page' => $properties->currentPage(),
                'total' => $properties->total(),
                'per_page' => $properties->perPage(),
                'next_page' => $properties->nextPageUrl() ? $properties->nextPageUrl() : null,
                'prev_page' => $properties->previousPageUrl() ? $properties->previous->previousPageUrl() : null,
            ]
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'zip_code' => 'required',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            'square_meters' => 'required|numeric',
            'image' => 'nullable|image',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validatedData = $validator->validated();

        $user = $request->user();
        $property = $user->properties()->create($validatedData);

        return response()->json($property, 201);
    }

    public function show($id)
    {
        try {
            $property = Property::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Propiedad no encontrada'], 404);
        }

        if ($property->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($property, 200);
    }

    public function update(Request $request, $id)
    {
        $property = Property::findOrfail($id);

        if ($property->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|max:255',
            'description' => 'sometimes|required',
            'price' => 'sometimes|required|numeric',
            'address' => 'sometimes|required',
            'city' => 'sometimes|required',
            'state' => 'sometimes|required',
            'zip_code' => 'sometimes|required',
            'bedrooms' => 'sometimes|required|integer',
            'bathrooms' => 'sometimes|required|integer',
            'square_meters' => 'sometimes|required|numeric',
            'image' => 'sometimes|nullable|image',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validatedData = $validator->validated();

        $property->fill($validatedData)->save();

        return response()->json($property, 200);
    }

    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        if ($property->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $property->delete();

        return response()->noContent(204);
    }
}
