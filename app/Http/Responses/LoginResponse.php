<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        $user = auth()->user();
        
        // Redirect based on user role
        if ($user->hasRole('teacher')) {
            $redirectUrl = route('teacher.dashboard');
        } elseif ($user->hasRole('super_admin') || $user->hasRole('admin') || $user->hasRole('editor') || $user->hasRole('penulis')) {
            $redirectUrl = route('dashboard');
        } else {
            // Default dashboard for regular users
            $redirectUrl = route('dashboard');
        }

        return $request->wantsJson()
                    ? new JsonResponse([], 200)
                    : redirect()->intended($redirectUrl);
    }
}