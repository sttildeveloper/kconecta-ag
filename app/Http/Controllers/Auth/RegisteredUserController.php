<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserLevel;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.auth', [
            'mode' => 'register',
            'userLevels' => UserLevel::orderBy('id')->get(),
            'documentTypes' => $this->documentTypes(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'user_level_id' => 'required|integer|exists:user_level,id',
            'document_type' => 'required|string|max:25',
            'document_number' => 'required|string|max:25',
            'first_name' => 'required|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'phone' => 'required|string|max:20',
            'landline_phone' => 'nullable|string|max:100',
            'address' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:50|unique:user,email',
            'password' => ['required', 'confirmed', 'min:6'],
        ]);

        $email = (string) $request->email;
        $userName = Str::before($email, '@');

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'user_name' => $userName,
            'email' => $email,
            'phone' => $request->phone,
            'landline_phone' => $request->landline_phone,
            'document_type' => $request->document_type,
            'document_number' => $request->document_number,
            'address' => $request->address,
            'user_level_id' => (int) $request->user_level_id,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect($this->redirectPathForUser($user));
    }

    private function documentTypes(): array
    {
        return [
            'DNI',
            'NIE',
            'Pasaporte',
            'Otro',
        ];
    }

    private function redirectPathForUser(User $user): string
    {
        if ($user->isAdmin()) {
            return route('dashboard', absolute: false);
        }

        if ($user->canManageServices() && ! $user->canManageProperties()) {
            return url('/post/services');
        }

        if ($user->canManageProperties()) {
            return url('/post/my_posts');
        }

        return route('dashboard', absolute: false);
    }
}
