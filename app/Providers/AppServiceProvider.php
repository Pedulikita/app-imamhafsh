<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use App\Listeners\UpdateLastLoginAt;
use Illuminate\Support\Facades\Gate;
use App\Models\Facility;
use App\Policies\FacilityPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register login event listener
        Event::listen(Login::class, UpdateLastLoginAt::class);

        // Register policies
        Gate::policy(Facility::class, FacilityPolicy::class);
    }
}
