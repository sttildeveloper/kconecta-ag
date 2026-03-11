<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

Route::get('/properties', [ApiController::class, 'searchProperties']);
Route::get('/services', [ApiController::class, 'searchServices']);
Route::get('/properties_for_map', [ApiController::class, 'dataPropertiesForMap']);
Route::get('/services_for_map', [ApiController::class, 'dataServicesForMap']);
Route::get('/delete_more_image', [ApiController::class, 'deleteMoreImage']);
Route::post('/visitor/save', [ApiController::class, 'visitorRegister']);
Route::post('/visitor/contacted', [ApiController::class, 'visitorContactedUpdate']);
Route::post('/google/user/verify_token_google', [ApiController::class, 'verifyTokenGoogleFloat']);
Route::post('/send/message/email_to_provider', [ApiController::class, 'sendEmailContactUser']);
Route::get('/send/message/email_share', [ApiController::class, 'sendEmailShare']);
Route::post('/property_stats/register', [ApiController::class, 'propertyStatsConfig']);
