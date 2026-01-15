<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Illuminate\Http\RedirectResponse as LaravelRedirectResponse;

class SocialAuthController extends Controller
{
    /**
     * Redirect to social provider for authentication
     */
    public function redirect(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        try {
            return Socialite::driver($provider)->redirect();
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Error connecting to ' . ucfirst($provider) . '. Please try again.');
        }
    }

    /**
     * Handle callback from social provider
     */
    public function callback(string $provider): LaravelRedirectResponse
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
            
            // Find or create user
            $user = $this->findOrCreateUser($socialUser, $provider);
            
            // Log the user in
            Auth::login($user, true);
            
            // Redirect based on user role
            return $this->redirectBasedOnRole($user);
            
        } catch (\Exception $e) {
            \Log::error('Social login callback error: ' . $e->getMessage());
            
            return redirect()->route('login')
                ->with('error', 'Authentication failed. Please try again.');
        }
    }

    /**
     * Validate social provider
     */
    private function validateProvider(string $provider): void
    {
        $allowedProviders = ['google', 'facebook', 'github'];
        
        if (!in_array($provider, $allowedProviders)) {
            abort(404);
        }
    }

    /**
     * Find existing user or create new one
     */
    private function findOrCreateUser($socialUser, string $provider): User
    {
        // Check if user already exists with this social account
        $existingUser = User::where($provider . '_id', $socialUser->getId())->first();
        
        if ($existingUser) {
            // Update user info if needed
            $this->updateSocialUserInfo($existingUser, $socialUser, $provider);
            return $existingUser;
        }

        // Check if user exists with same email
        $userWithEmail = User::where('email', $socialUser->getEmail())->first();
        
        if ($userWithEmail) {
            // Link social account to existing user
            $this->linkSocialAccount($userWithEmail, $socialUser, $provider);
            return $userWithEmail;
        }

        // Create new user
        return $this->createNewSocialUser($socialUser, $provider);
    }

    /**
     * Create new user from social account
     */
    private function createNewSocialUser($socialUser, string $provider): User
    {
        $user = User::create([
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
            'email' => $socialUser->getEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make(Str::random(32)), // Random password
            $provider . '_id' => $socialUser->getId(),
            $provider . '_avatar' => $socialUser->getAvatar(),
        ]);

        // Assign default user role
        $userRole = Role::where('name', 'user')->first();
        if ($userRole) {
            $user->roles()->attach($userRole);
        }

        return $user;
    }

    /**
     * Link social account to existing user
     */
    private function linkSocialAccount(User $user, $socialUser, string $provider): void
    {
        $user->update([
            $provider . '_id' => $socialUser->getId(),
            $provider . '_avatar' => $socialUser->getAvatar(),
        ]);
    }

    /**
     * Update existing social user info
     */
    private function updateSocialUserInfo(User $user, $socialUser, string $provider): void
    {
        // Update avatar if changed
        if ($socialUser->getAvatar() && $user->{$provider . '_avatar'} !== $socialUser->getAvatar()) {
            $user->update([
                $provider . '_avatar' => $socialUser->getAvatar(),
            ]);
        }
    }

    /**
     * Redirect user based on their role
     */
    private function redirectBasedOnRole(User $user): LaravelRedirectResponse
    {
        if ($user->hasRole('super_admin')) {
            return redirect()->intended('/admin/dashboard');
        }
        
        if ($user->hasRole('teacher')) {
            return redirect()->intended('/teacher/dashboard');
        }
        
        if ($user->hasRole(['editor', 'penulis'])) {
            return redirect()->intended('/admin/articles');
        }
        
        return redirect()->intended('/dashboard');
    }

    /**
     * Unlink social account
     */
    public function unlink(Request $request, string $provider): LaravelRedirectResponse
    {
        $this->validateProvider($provider);
        
        $user = Auth::user();
        
        // Check if user has password (can't unlink if no password)
        if (!$user->password && $this->isOnlySocialAccount($user, $provider)) {
            return back()->with('error', 'Cannot unlink your only login method. Please set a password first.');
        }
        
        $user->update([
            $provider . '_id' => null,
            $provider . '_avatar' => null,
        ]);
        
        return back()->with('success', ucfirst($provider) . ' account unlinked successfully.');
    }

    /**
     * Check if this is user's only social account
     */
    private function isOnlySocialAccount(User $user, string $currentProvider): bool
    {
        $providers = ['google', 'facebook', 'github'];
        $linkedProviders = 0;
        
        foreach ($providers as $provider) {
            if ($user->{$provider . '_id'}) {
                $linkedProviders++;
            }
        }
        
        return $linkedProviders === 1;
    }
}
