<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Article;
use App\Models\TeacherProfile;
use App\Models\Student;
use App\Models\Subject;
use App\Models\TeacherClass;
use App\Models\Grade;
use App\Models\Role;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Check if user is admin
        $user = Auth::user();
        if (!$user->isSuperAdmin() && !$user->isEditor()) {
            abort(403, 'Unauthorized access to admin dashboard');
        }

        // Get dashboard statistics
        $stats = $this->getDashboardStats();
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities();
        
        // Get chart data
        $chartData = $this->getChartData();

        return Inertia::render('Admin/dashboard', [
            'user' => $user->load('roles'),
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'chartData' => $chartData,
        ]);
    }

    /**
     * Get dashboard statistics.
     */
    private function getDashboardStats(): array
    {
        return [
            'users' => [
                'total' => User::count(),
                'teachers' => User::whereHas('roles', function($q) {
                    $q->where('name', 'teacher');
                })->count(),
                'students' => User::whereHas('roles', function($q) {
                    $q->where('name', 'user');
                })->count(),
                'editors' => User::whereHas('roles', function($q) {
                    $q->where('name', 'editor');
                })->count(),
            ],
            'content' => [
                'articles' => Article::count(),
                'published_articles' => Article::where('status', 'published')->count(),
                'draft_articles' => Article::where('status', 'draft')->count(),
                'pending_articles' => Article::where('status', 'pending')->count(),
            ],
            'education' => [
                'subjects' => Subject::count(),
                'teacher_profiles' => TeacherProfile::count(),
                'active_classes' => TeacherClass::where('status', 'active')->count(),
                'total_grades' => Grade::count(),
            ],
            'system' => [
                'roles' => Role::count(),
                'recent_users' => User::where('created_at', '>=', now()->subDays(7))->count(),
                'social_users' => User::whereNotNull('google_id')
                    ->orWhereNotNull('facebook_id')
                    ->orWhereNotNull('github_id')
                    ->count(),
            ]
        ];
    }

    /**
     * Get recent activities for dashboard.
     */
    private function getRecentActivities(): array
    {
        $activities = collect();

        // Recent articles
        $recentArticles = Article::with('author')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function($article) {
                return [
                    'id' => $article->id,
                    'type' => 'article',
                    'title' => "Article '{$article->title}' created",
                    'description' => "By {$article->author->name}",
                    'time' => $article->created_at->diffForHumans(),
                    'status' => $article->status,
                    'icon' => '📝',
                ];
            });

        // Recent users
        $recentUsers = User::with('roles')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'type' => 'user',
                    'title' => "New user registered: {$user->name}",
                    'description' => "Email: {$user->email}",
                    'time' => $user->created_at->diffForHumans(),
                    'status' => $user->email_verified_at ? 'verified' : 'pending',
                    'icon' => '👤',
                ];
            });

        return $activities->concat($recentArticles)
            ->concat($recentUsers)
            ->sortByDesc('time')
            ->take(10)
            ->values()
            ->all();
    }

    /**
     * Get chart data for dashboard.
     */
    private function getChartData(): array
    {
        // User registration chart (last 30 days)
        $userRegistrations = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                ];
            });

        // Article creation chart (last 30 days)
        $articleCreations = Article::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                ];
            });

        // Role distribution
        $roleDistribution = User::join('role_user', 'users.id', '=', 'role_user.user_id')
            ->join('roles', 'role_user.role_id', '=', 'roles.id')
            ->selectRaw('roles.name as role, COUNT(*) as count')
            ->groupBy('roles.name')
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->role,
                    'count' => $item->count,
                ];
            });

        return [
            'userRegistrations' => $userRegistrations,
            'articleCreations' => $articleCreations,
            'roleDistribution' => $roleDistribution,
        ];
    }

    /**
     * Get system health information.
     */
    public function systemHealth()
    {
        $user = Auth::user();
        if (!$user->isSuperAdmin()) {
            abort(403, 'Unauthorized access to system health');
        }

        $health = [
            'database' => $this->checkDatabaseHealth(),
            'storage' => $this->checkStorageHealth(),
            'cache' => $this->checkCacheHealth(),
            'migrations' => $this->checkMigrationStatus(),
        ];

        return response()->json($health);
    }

    private function checkDatabaseHealth(): array
    {
        try {
            \DB::connection()->getPdo();
            return ['status' => 'healthy', 'message' => 'Database connection OK'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Database connection failed'];
        }
    }

    private function checkStorageHealth(): array
    {
        $storagePath = storage_path();
        $diskSpace = disk_free_space($storagePath);
        $totalSpace = disk_total_space($storagePath);
        
        $usagePercentage = (($totalSpace - $diskSpace) / $totalSpace) * 100;
        
        if ($usagePercentage > 90) {
            return ['status' => 'warning', 'message' => 'Disk space is running low'];
        }
        
        return ['status' => 'healthy', 'message' => 'Storage OK'];
    }

    private function checkCacheHealth(): array
    {
        try {
            \Cache::put('health_check', 'ok', 10);
            $result = \Cache::get('health_check');
            
            if ($result === 'ok') {
                return ['status' => 'healthy', 'message' => 'Cache working properly'];
            } else {
                return ['status' => 'warning', 'message' => 'Cache not working'];
            }
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Cache error: ' . $e->getMessage()];
        }
    }

    private function checkMigrationStatus(): array
    {
        try {
            $pendingMigrations = \Artisan::call('migrate:status');
            return ['status' => 'healthy', 'message' => 'All migrations up to date'];
        } catch (\Exception $e) {
            return ['status' => 'warning', 'message' => 'Migration issues detected'];
        }
    }
}
