 <?php

use App\Http\Controllers\TeacherClassController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

// Debug endpoint
Route::get('/debug/user', function() {
    if (!auth()->check()) {
        return response()->json(['error' => 'Not authenticated']);
    }
    $user = auth()->user();
    return response()->json([
        'email' => $user->email,
        'roles' => $user->roles->pluck('name'),
        'has_parent_role' => $user->hasRole('parent'),
        'parent_profile_exists' => $user->parentProfile ? true : false,
        'parent_profile_id' => $user->parentProfile?->id,
    ]);
});

// Redirect incorrect admin/storage requests to correct storage path
Route::get('/admin/storage/{path}', function ($path) {
    return redirect('/storage/' . $path, 301);
})->where('path', '.*');

Route::get('/about', [\App\Http\Controllers\PublicPageController::class, 'about'])->name('about');
Route::get('/nilai', [\App\Http\Controllers\PublicPageController::class, 'nilai'])->name('nilai');
Route::get('/mutu', [\App\Http\Controllers\PublicPageController::class, 'mutu'])->name('mutu');
Route::get('/kurikulum', [\App\Http\Controllers\PublicPageController::class, 'kurikulum'])->name('kurikulum');

Route::get('/team', [\App\Http\Controllers\PublicContentController::class, 'team'])->name('team');

Route::get('/project', [\App\Http\Controllers\PublicContentController::class, 'project'])->name('project');

Route::get('/activities', [\App\Http\Controllers\PublicContentController::class, 'activities'])->name('activities');

Route::get('/ekstrakurikuler', [\App\Http\Controllers\PublicContentController::class, 'ekstrakurikuler'])->name('ekstrakurikuler');

Route::get('/achievements', [\App\Http\Controllers\PublicContentController::class, 'achievements'])->name('achievements');

Route::get('/literasi', [\App\Http\Controllers\PublicContentController::class, 'literasi'])->name('literasi');

Route::get('/fasilitas', [\App\Http\Controllers\PublicContentController::class, 'fasilitas'])->name('fasilitas');

Route::get('/articles', [\App\Http\Controllers\PublicArticleController::class, 'index'])->name('articles');

Route::get('/articles/{slug}', [\App\Http\Controllers\PublicArticleController::class, 'show'])->name('public.article.show');

Route::get('/events', [\App\Http\Controllers\PublicContentController::class, 'events'])->name('events');

Route::get('/testimoni', [\App\Http\Controllers\PublicContentController::class, 'testimoni'])->name('testimoni');

Route::get('/pendaftaran', [\App\Http\Controllers\PublicContentController::class, 'pendaftaran'])->name('pendaftaran');

// Student Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login-choice', [\App\Http\Controllers\Auth\LoginChoiceController::class, 'show'])
        ->name('login.choice');
    
    Route::get('/student/login', [\App\Http\Controllers\Auth\StudentAuthController::class, 'create'])
        ->name('student.login');
    Route::post('/student/login', [\App\Http\Controllers\Auth\StudentAuthController::class, 'store']);
});

// Custom login route that allows both guests and authenticated users
Route::middleware('guest_or_auth')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Auth\FortifyLoginController::class, 'show'])
        ->name('login');
});

Route::middleware('auth')->group(function () {
    Route::post('/student/logout', [\App\Http\Controllers\Auth\StudentAuthController::class, 'destroy'])
        ->name('student.logout');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Hero Slides Management (Super Admin and Editor can manage)
    Route::middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('hero-slides', \App\Http\Controllers\HeroSlideController::class);
    });

    // Role Management Routes (Super Admin only)
    Route::middleware(['role:super_admin'])->group(function () {
        Route::resource('roles', \App\Http\Controllers\RoleController::class);
        Route::post('roles/assign', [\App\Http\Controllers\RoleController::class, 'assignToUser'])->name('roles.assign');
        Route::delete('roles/remove', [\App\Http\Controllers\RoleController::class, 'removeFromUser'])->name('roles.remove');
        
        Route::resource('permissions', \App\Http\Controllers\PermissionController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    // Role Management Routes (Super Admin only) - dengan prefix admin
    Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'role:super_admin'])->group(function () {
        Route::resource('roles', \App\Http\Controllers\RoleController::class);
        Route::post('roles/assign', [\App\Http\Controllers\RoleController::class, 'assignToUser'])->name('roles.assign');
        Route::delete('roles/remove', [\App\Http\Controllers\RoleController::class, 'removeFromUser'])->name('roles.remove');
        
        Route::resource('permissions', \App\Http\Controllers\PermissionController::class)->only(['index', 'store', 'update', 'destroy']);
        
        // User Management Routes
        Route::resource('users', \App\Http\Controllers\UserController::class);
        Route::post('users/assign-role', [\App\Http\Controllers\UserController::class, 'assignRole'])->name('users.assign-role');
        Route::delete('users/remove-role', [\App\Http\Controllers\UserController::class, 'removeRole'])->name('users.remove-role');
        
        // Site Settings Routes
        Route::get('settings/contact', [\App\Http\Controllers\Admin\SettingsController::class, 'contact'])->name('settings.contact');
        Route::get('settings/social', [\App\Http\Controllers\Admin\SettingsController::class, 'social'])->name('settings.social');
        Route::put('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
        Route::post('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.store');
        Route::post('settings/initialize-defaults', [\App\Http\Controllers\Admin\SettingsController::class, 'initializeDefaults'])->name('settings.initialize-defaults');
        Route::delete('settings/{setting}', [\App\Http\Controllers\Admin\SettingsController::class, 'destroy'])->name('settings.destroy');
    });

    // Pages Management (Super Admin and Editor can manage)
    Route::middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('pages', \App\Http\Controllers\PageController::class)->except(['show']);
    });

    // Categories Management (Super Admin and Editor can manage)
    Route::middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('categories', \App\Http\Controllers\CategoryController::class);
    });

    // Literasi Content Management (Super Admin and Editor can manage)
    Route::prefix('admin')->middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('literasi-content', \App\Http\Controllers\LiterasiContentController::class)->except(['show']);
    });

    // Profile Pages Management (Super Admin and Editor can manage)
    Route::prefix('admin')->middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('profile-pages', \App\Http\Controllers\ProfilePageController::class)->except(['show']);
        // Debug route
        Route::get('profile-pages-debug', function() {
            $pages = \App\Models\ProfilePage::orderBy('order', 'asc')->orderBy('id', 'desc')->paginate(15);
            return response()->json([
                'total_count' => \App\Models\ProfilePage::count(),
                'pages' => $pages,
                'raw_data' => \App\Models\ProfilePage::all(['id', 'title', 'slug', 'is_active', 'order'])
            ]);
        });
    });

    // Home Sections Management (Super Admin and Editor can manage)
    Route::prefix('admin')->middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('home-sections', \App\Http\Controllers\HomeSectionController::class)->except(['show']);
    });

    // Content Management - Projects, Activities, Events, etc (Super Admin and Editor can manage)
    Route::prefix('admin')->name('admin.')->middleware(['role:super_admin,editor'])->group(function () {
        Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class)->except(['show']);
        Route::resource('activities', \App\Http\Controllers\Admin\ActivityController::class)->except(['show']);
        Route::resource('achievements', \App\Http\Controllers\Admin\AchievementController::class)->except(['show']);
        Route::resource('events', \App\Http\Controllers\Admin\EventController::class)->except(['show']);
        Route::resource('testimonies', \App\Http\Controllers\Admin\TestimonyController::class)->except(['show']);
        Route::resource('team-members', \App\Http\Controllers\Admin\TeamMemberController::class)->except(['show']);
        Route::resource('ekstrakurikuler', \App\Http\Controllers\Admin\EkstrakurikulerController::class)->except(['show']);
        Route::resource('donation-embeds', \App\Http\Controllers\Admin\DonationEmbedController::class)->except(['show']);
        Route::resource('facilities', \App\Http\Controllers\FacilityController::class)->except(['show']);
        Route::post('facilities/{facility}/toggle-active', [\App\Http\Controllers\FacilityController::class, 'toggleActive'])->name('facilities.toggle-active');
    });

    // Articles Management Routes
    Route::prefix('admin/articles')->name('articles.')->group(function () {
        // View articles - accessible by penulis, editor, admin, super_admin
        Route::get('/', [\App\Http\Controllers\ArticleController::class, 'index'])
            ->middleware(['role:penulis,editor,admin,super_admin'])
            ->name('index');
        
        // Create articles - accessible by penulis, editor, admin, super_admin
        Route::get('/create', [\App\Http\Controllers\ArticleController::class, 'create'])
            ->middleware(['role:penulis,editor,admin,super_admin'])
            ->name('create');
        
        Route::post('/', [\App\Http\Controllers\ArticleController::class, 'store'])
            ->middleware(['role:penulis,editor,admin,super_admin'])
            ->name('store');
        
        // Edit articles - accessible by penulis (own), editor, admin, super_admin
        Route::get('/{article}/edit', [\App\Http\Controllers\ArticleController::class, 'edit'])
            ->middleware(['role:penulis,editor,admin,super_admin'])
            ->name('edit');
        
        Route::put('/{article}', [\App\Http\Controllers\ArticleController::class, 'update'])
            ->middleware(['role:penulis,editor,admin,super_admin'])
            ->name('update');
        
        // Delete articles - accessible by penulis (own), editor, admin, super_admin
        Route::delete('/{article}', [\App\Http\Controllers\ArticleController::class, 'destroy'])
            ->middleware(['role:penulis,editor,admin,super_admin'])
            ->name('destroy');
    });

    // Student Monitoring System Routes
    Route::prefix('monitoring')->name('monitoring.')->middleware(['auth'])->group(function () {
        // Dashboard
        Route::get('/', [\App\Http\Controllers\Student\ProgressController::class, 'dashboard'])
            ->name('dashboard');
        
        // Progress Reports Overview
        Route::get('/progress', [\App\Http\Controllers\Student\ProgressController::class, 'progressOverview'])
            ->name('progress');

        // Attendance Recording System
        Route::get('/attendance/recording', [\App\Http\Controllers\Student\AttendanceController::class, 'recording'])
            ->name('attendance.recording');
        Route::post('/attendance/store', [\App\Http\Controllers\Student\AttendanceController::class, 'store'])
            ->name('attendance.store');
        
        // Redirect old student routes to new student-management routes
        Route::get('students', [\App\Http\Controllers\Monitoring\StudentRedirectController::class, 'index']);
        Route::get('students/create', [\App\Http\Controllers\Monitoring\StudentRedirectController::class, 'create']);
        Route::get('students/{id}', [\App\Http\Controllers\Monitoring\StudentRedirectController::class, 'show']);
        Route::get('students/{id}/edit', [\App\Http\Controllers\Monitoring\StudentRedirectController::class, 'edit']);
        
        // Student Progress (keep this as it's different functionality)
        Route::get('students/{student}/progress', [\App\Http\Controllers\Student\ProgressController::class, 'studentProgress'])
            ->name('students.progress');
        
        // Class Progress
    // Student Management System Routes
    Route::prefix('student-management')->name('student-management.')->middleware(['auth', 'role:super_admin,admin,teacher'])->group(function () {
        // Student CRUD routes
        Route::get('/', [\App\Http\Controllers\StudentController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\StudentController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\StudentController::class, 'store'])->name('store');
        Route::get('/{student}', [\App\Http\Controllers\StudentController::class, 'show'])->name('show');
        Route::get('/{student}/edit', [\App\Http\Controllers\StudentController::class, 'edit'])->name('edit');
        Route::put('/{student}', [\App\Http\Controllers\StudentController::class, 'update'])->name('update');
        Route::delete('/{student}', [\App\Http\Controllers\StudentController::class, 'destroy'])->name('destroy');
        
        // Bulk operations
        Route::post('/bulk-delete', [\App\Http\Controllers\StudentController::class, 'bulkDelete'])->name('bulk-delete');
        Route::post('/bulk-status', [\App\Http\Controllers\StudentController::class, 'bulkStatus'])->name('bulk-status');
        
        // Import/Export functionality
        Route::get('/import', [\App\Http\Controllers\StudentController::class, 'importForm'])->name('import');
        Route::post('/import/validate', [\App\Http\Controllers\StudentController::class, 'validateImport'])->name('import.validate');
        Route::post('/import/execute', [\App\Http\Controllers\StudentController::class, 'executeImport'])->name('import.execute');
        Route::get('/export', [\App\Http\Controllers\StudentController::class, 'export'])->name('export');
        
        // Print functionality
        Route::get('/print', [\App\Http\Controllers\StudentController::class, 'printList'])->name('print');
        Route::get('/{student}/print', [\App\Http\Controllers\StudentController::class, 'printProfile'])->name('print.profile');
        
        // Enrollment routes
        Route::get('/enrollments', [\App\Http\Controllers\StudentEnrollmentController::class, 'index'])->name('enrollments.index');
        Route::get('/enrollments/create', [\App\Http\Controllers\StudentEnrollmentController::class, 'create'])->name('enrollments.create');
        Route::post('/enrollments', [\App\Http\Controllers\StudentEnrollmentController::class, 'store'])->name('enrollments.store');
        Route::get('/enrollments/{enrollment}/edit', [\App\Http\Controllers\StudentEnrollmentController::class, 'edit'])->name('enrollments.edit');
        Route::put('/enrollments/{enrollment}', [\App\Http\Controllers\StudentEnrollmentController::class, 'update'])->name('enrollments.update');
        Route::delete('/enrollments/{enrollment}', [\App\Http\Controllers\StudentEnrollmentController::class, 'destroy'])->name('enrollments.destroy');
        
        // Quick enrollment
        Route::post('/quick-enroll', [\App\Http\Controllers\StudentEnrollmentController::class, 'quickEnroll'])->name('quick-enroll');
        
        // Enrollment bulk operations
        Route::post('/enrollments/bulk', [\App\Http\Controllers\StudentEnrollmentController::class, 'bulkEnroll'])->name('enrollments.bulk');
    });

    // Student Class Management Routes (Admin only)
    Route::prefix('classes')->name('classes.')->middleware(['auth', 'role:super_admin,admin'])->group(function () {
        Route::get('/', [\App\Http\Controllers\StudentClassController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\StudentClassController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\StudentClassController::class, 'store'])->name('store');
        Route::get('/{class}', [\App\Http\Controllers\StudentClassController::class, 'show'])->name('show');
        Route::get('/{class}/edit', [\App\Http\Controllers\StudentClassController::class, 'edit'])->name('edit');
        Route::put('/{class}', [\App\Http\Controllers\StudentClassController::class, 'update'])->name('update');
        Route::delete('/{class}', [\App\Http\Controllers\StudentClassController::class, 'destroy'])->name('destroy');
        
        // Class enrollment management
        Route::get('/{class}/students', [\App\Http\Controllers\StudentClassController::class, 'showStudents'])->name('students');
        Route::post('/{class}/enroll', [\App\Http\Controllers\StudentClassController::class, 'enrollStudent'])->name('enroll');
        Route::delete('/{class}/remove/{student}', [\App\Http\Controllers\StudentClassController::class, 'removeStudent'])->name('remove-student');
    });        Route::get('classes/{class}/progress', [\App\Http\Controllers\Student\ProgressController::class, 'classProgress'])
            ->name('classes.progress');
    });

    // Teacher Class Management Routes
    Route::prefix('teacher')->name('teacher.')
        ->middleware(['auth', 'verified', 'role:teacher,super_admin'])
        ->group(function () {
        // Teacher Dashboard
        Route::get('dashboard', [TeacherClassController::class, 'dashboard'])
            ->name('dashboard');
            
        // Teacher Communication (temporary redirects to dashboard)
        Route::get('messages', [TeacherClassController::class, 'dashboard'])
            ->name('messages');
        Route::get('announcements', [TeacherClassController::class, 'dashboard'])
            ->name('announcements');
        Route::get('parent-communication', [TeacherClassController::class, 'dashboard'])
            ->name('parent-communication');
            
        // Teacher Class Management
        Route::resource('classes', TeacherClassController::class);
        
        // Class Attendance Management
        Route::get('classes/{class}/attendance', [TeacherClassController::class, 'attendance'])
            ->name('classes.attendance');
        Route::post('classes/{class}/attendance', [TeacherClassController::class, 'storeAttendance'])
            ->name('classes.attendance.store');
        
        // Class Reports
        Route::get('classes/{class}/report', [TeacherClassController::class, 'classReport'])
            ->name('classes.report');
        
        // Teacher-wide Management Routes
        Route::get('attendance', [TeacherClassController::class, 'attendanceOverview'])
            ->name('attendance');
        Route::get('grades', [TeacherClassController::class, 'gradesOverview'])
            ->name('grades');
        Route::get('reports', [TeacherClassController::class, 'reportsOverview'])
            ->name('reports');
            
        // Grade Management CRUD Routes
        Route::post('grades', [TeacherClassController::class, 'storeGrade'])
            ->name('grades.store');
        Route::put('grades/{gradeId}', [TeacherClassController::class, 'updateGrade'])
            ->name('grades.update');
        Route::delete('grades/{gradeId}', [TeacherClassController::class, 'deleteGrade'])
            ->name('grades.delete');
        Route::get('grades/export', [TeacherClassController::class, 'exportGrades'])
            ->name('grades.export');
        
        // Student Management within Class
        Route::post('classes/{class}/students/{student}', [TeacherClassController::class, 'addStudent'])
            ->name('classes.students.add');
        Route::delete('classes/{class}/students/{student}', [TeacherClassController::class, 'removeStudent'])
            ->name('classes.students.remove');
            
        // Exam Management Routes (NEW!)
        Route::prefix('exams')->name('exams.')->group(function() {
            Route::get('/', [\App\Http\Controllers\Teacher\ExamController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\Teacher\ExamController::class, 'create'])->name('create');
            Route::post('/', [\App\Http\Controllers\Teacher\ExamController::class, 'store'])->name('store');
            
            // Overview routes (without exam ID) - MUST be before parameterized routes
            Route::get('/questions', [\App\Http\Controllers\Teacher\ExamController::class, 'questionBank'])->name('questions.bank');
            Route::get('/results', [\App\Http\Controllers\Teacher\ExamController::class, 'resultsOverview'])->name('results.overview');
            
            Route::get('/{exam}', [\App\Http\Controllers\Teacher\ExamController::class, 'show'])->name('show');
            Route::get('/{exam}/edit', [\App\Http\Controllers\Teacher\ExamController::class, 'edit'])->name('edit');
            Route::put('/{exam}', [\App\Http\Controllers\Teacher\ExamController::class, 'update'])->name('update');
            Route::delete('/{exam}', [\App\Http\Controllers\Teacher\ExamController::class, 'destroy'])->name('destroy');
            
            // Question Management
            Route::get('/{exam}/questions', [\App\Http\Controllers\Teacher\ExamController::class, 'questions'])->name('questions');
            Route::post('/{exam}/questions', [\App\Http\Controllers\Teacher\ExamController::class, 'storeQuestion'])->name('questions.store');
            Route::put('/questions/{question}', [\App\Http\Controllers\Teacher\ExamController::class, 'updateQuestion'])->name('questions.update');
            Route::delete('/questions/{question}', [\App\Http\Controllers\Teacher\ExamController::class, 'destroyQuestion'])->name('questions.destroy');
            
            // Exam Actions
            Route::post('/{exam}/publish', [\App\Http\Controllers\Teacher\ExamController::class, 'publish'])->name('publish');
            Route::post('/{exam}/unpublish', [\App\Http\Controllers\Teacher\ExamController::class, 'unpublish'])->name('unpublish');
            
            // Results & Analytics
            Route::get('/{exam}/results', [\App\Http\Controllers\Teacher\ExamController::class, 'results'])->name('results');
            Route::get('/{exam}/analytics', [\App\Http\Controllers\Teacher\ExamController::class, 'analytics'])->name('analytics');
            Route::get('/attempts/{attempt}', [\App\Http\Controllers\Teacher\ExamController::class, 'viewAttempt'])->name('attempts.view');
            Route::post('/attempts/{attempt}/grade', [\App\Http\Controllers\Teacher\ExamController::class, 'gradeAttempt'])->name('attempts.grade');
        });
        
        // Schedule Management Routes (NEW!)
        Route::prefix('schedules')->name('schedules.')->group(function() {
            Route::get('/', [\App\Http\Controllers\Teacher\ScheduleController::class, 'index'])->name('index');
            Route::get('/weekly', [\App\Http\Controllers\Teacher\ScheduleController::class, 'weekly'])->name('weekly');
            Route::get('/create', [\App\Http\Controllers\Teacher\ScheduleController::class, 'create'])->name('create');
            Route::post('/', [\App\Http\Controllers\Teacher\ScheduleController::class, 'store'])->name('store');
            Route::get('/{schedule}', [\App\Http\Controllers\Teacher\ScheduleController::class, 'show'])->name('show');
            Route::get('/{schedule}/edit', [\App\Http\Controllers\Teacher\ScheduleController::class, 'edit'])->name('edit');
            Route::put('/{schedule}', [\App\Http\Controllers\Teacher\ScheduleController::class, 'update'])->name('update');
            Route::delete('/{schedule}', [\App\Http\Controllers\Teacher\ScheduleController::class, 'destroy'])->name('destroy');
            
            // Conflict checking
            Route::post('/check-conflict', [\App\Http\Controllers\Teacher\ScheduleController::class, 'checkConflict'])->name('check-conflict');
        });
        
        // Communication Routes
        Route::get('/announcements', [\App\Http\Controllers\Teacher\AnnouncementController::class, 'index'])->name('announcements');
        Route::get('/messages', [\App\Http\Controllers\Teacher\MessageController::class, 'index'])->name('messages');
        Route::get('/parent-communication', [\App\Http\Controllers\Teacher\ParentCommunicationController::class, 'index'])->name('parent-communication');
    });
});

// Parent Routes
Route::middleware(['auth', 'verified', 'role:parent'])->prefix('parent')->name('parent.')->group(function() {
    Route::get('/dashboard', [\App\Http\Controllers\ParentController::class, 'dashboard'])->name('dashboard');
    Route::get('/child/{student}', [\App\Http\Controllers\ParentController::class, 'showChild'])->name('child.show');
    Route::get('/child/{student}/grades', [\App\Http\Controllers\ParentController::class, 'childGrades'])->name('child.grades');
    Route::get('/child/{student}/attendance', [\App\Http\Controllers\ParentController::class, 'childAttendance'])->name('child.attendance');
    Route::get('/communications', [\App\Http\Controllers\ParentController::class, 'communications'])->name('communications');
    Route::get('/announcements', [\App\Http\Controllers\ParentController::class, 'announcements'])->name('announcements');
    Route::get('/profile', [\App\Http\Controllers\ParentController::class, 'profileSettings'])->name('profile');
    Route::put('/profile', [\App\Http\Controllers\ParentController::class, 'updateProfileSettings'])->name('profile.update');
});

// Student Routes
Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function() {
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Student\StudentDashboardController::class, 'dashboard'])->name('dashboard');
    
    // Student Views
    Route::get('/assignments', [\App\Http\Controllers\Student\StudentViewController::class, 'assignments'])->name('assignments');
    Route::get('/grades', [\App\Http\Controllers\Student\StudentViewController::class, 'grades'])->name('grades');
    Route::get('/schedule', [\App\Http\Controllers\Student\StudentViewController::class, 'schedule'])->name('schedule');
    Route::get('/attendance', [\App\Http\Controllers\Student\StudentViewController::class, 'attendance'])->name('attendance');
    Route::get('/exams', [\App\Http\Controllers\Student\StudentViewController::class, 'exams'])->name('exams');
});

// Monitoring Routes
Route::middleware(['auth', 'verified'])->prefix('monitoring')->name('monitoring.')->group(function() {
    Route::prefix('teacher')->name('teacher.')->group(function() {
        Route::get('/reports', [\App\Http\Controllers\Monitoring\TeacherReportsController::class, 'index'])->name('reports');
    });
});

// Public Routes for Pages and Articles
Route::get('/page/{slug}', [\App\Http\Controllers\PageController::class, 'show'])->name('page.show');
Route::get('/article/{slug}', [\App\Http\Controllers\ArticleController::class, 'show'])->name('article.show');
Route::get('/profile/{slug}', [\App\Http\Controllers\ProfilePageController::class, 'show'])->name('profile.show');

// Social Authentication Routes
Route::get('/auth/{provider}', [\App\Http\Controllers\SocialAuthController::class, 'redirect'])
    ->where('provider', 'google|facebook|github')
    ->name('social.redirect');

Route::get('/auth/{provider}/callback', [\App\Http\Controllers\SocialAuthController::class, 'callback'])
    ->where('provider', 'google|facebook|github')
    ->name('social.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/auth/{provider}/link', [\App\Http\Controllers\SocialAuthController::class, 'linkAccount'])
        ->where('provider', 'google|facebook|github')
        ->name('social.link');
    
    Route::delete('/auth/{provider}/unlink', [\App\Http\Controllers\SocialAuthController::class, 'unlinkAccount'])
        ->where('provider', 'google|facebook|github')
        ->name('social.unlink');
        
    // PDF Export Routes
    Route::prefix('pdf')->name('pdf.')->group(function () {
        Route::get('/teacher-profile', [\App\Http\Controllers\PDFExportController::class, 'exportTeacherProfile'])
            ->name('teacher.profile');
            
        Route::get('/class-report/{classId}', [\App\Http\Controllers\PDFExportController::class, 'exportClassReport'])
            ->name('class.report');
            
        Route::get('/student-transcript/{studentId}', [\App\Http\Controllers\PDFExportController::class, 'exportStudentTranscript'])
            ->name('student.transcript');
            
        Route::get('/article/{articleId}', [\App\Http\Controllers\PDFExportController::class, 'exportArticle'])
            ->name('article');
    });
});

require __DIR__.'/settings.php';
