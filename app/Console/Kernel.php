<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\BackupDatabase::class,
        Commands\CleanupLogs::class,
        Commands\OptimizeImages::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Database backup every day at 1:00 AM
        $schedule->command('backup:database')
                 ->dailyAt('01:00')
                 ->emailOutputOnFailure(['admin@imamhafsh.com']);

        // Clear expired sessions daily at 3:00 AM
        $schedule->command('session:gc')
                 ->dailyAt('03:00');

        // Log cleanup weekly
        $schedule->command('logs:cleanup')
                 ->weekly()
                 ->sundays()
                 ->at('02:00');

        // Cache optimization daily at 5:00 AM
        $schedule->command('cache:clear')
                 ->dailyAt('05:00');

        // Config and route cache refresh weekly
        $schedule->call(function () {
            \Artisan::call('config:cache');
            \Artisan::call('route:cache');
        })->weekly()->mondays()->at('06:00');

        // Optimize donated images monthly
        $schedule->command('images:optimize')
                 ->monthly()
                 ->at('07:00');

        // Database maintenance monthly
        $schedule->call(function () {
            // Clean up old sessions
            \DB::table('sessions')->where('last_activity', '<', now()->subDays(30)->timestamp)->delete();
            
            // Clean up expired cache entries
            \DB::table('cache')->where('expiration', '<', now()->timestamp)->delete();
            
            // Optimize donation_embeds table
            \DB::statement('OPTIMIZE TABLE donation_embeds');
        })->monthly()->at('01:30');

        // Health check every 30 minutes during business hours
        $schedule->call(function () {
            // Simple health check
            try {
                \DB::connection()->getPdo();
                \Log::info('Health check: System OK');
            } catch (\Exception $e) {
                \Log::error('Health check failed: ' . $e->getMessage());
            }
        })->everyThirtyMinutes()->between('08:00', '22:00');

        // Update donation statistics hourly
        $schedule->call(function () {
            // Update donation embed statistics if needed
            \App\Models\DonationEmbed::all()->each(function ($embed) {
                // Recalculate progress percentage and other stats
                $embed->save();
            });
        })->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}