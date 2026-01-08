<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'google_id',
        'facebook_id',
        'github_id',
        'provider_avatar',
        'provider_name',
        'social_linked_at',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'social_linked_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the roles that belong to the user.
     */
    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_array($roles)) {
            return $this->roles()->whereIn('name', $roles)->exists();
        }
        
        return $this->roles()->where('name', $roles)->exists();
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        // Super admin and admin have all permissions
        if ($this->hasRole(['super_admin', 'admin'])) {
            return true;
        }
        
        foreach ($this->roles as $role) {
            if ($role->hasPermission($permissionName)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if user is super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }
    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }
    /**
     * Get all permissions through roles.
     */
    public function getAllPermissions()
    {
        return Permission::whereHas('roles', function($query) {
            $query->whereIn('role_id', $this->roles->pluck('id'));
        })->get();
    }

    /**
     * Get the teacher profile associated with the user.
     */
    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    /**
     * Get the student profile associated with the user.
     */
    public function student()
    {
        return $this->hasOne(Student::class, 'email', 'email'); // Assuming students are linked by email
    }

    /**
     * Check if user is a teacher.
     */
    public function isTeacher(): bool
    {
        return $this->hasRole('teacher');
    }

    /**
     * Get teacher's classes if user is a teacher.
     */
    public function teacherClasses()
    {
        if ($this->isTeacher()) {
            return $this->hasMany(TeacherClass::class, 'teacher_id');
        }
        return null;
    }

    /**
     * Check if user is an editor.
     */
    public function isEditor(): bool
    {
        return $this->hasRole('editor');
    }

    /**
     * Check if user is a penulis (writer).
     */
    public function isPenulis(): bool
    {
        return $this->hasRole('penulis');
    }

    /**
     * Check if user can manage all articles.
     */
    public function canManageAllArticles(): bool
    {
        return $this->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Check if user can publish articles.
     */
    public function canPublishArticles(): bool
    {
        return $this->hasPermission('publish_articles');
    }

    /**
     * Check if user can edit specific article.
     */
    public function canEditArticle($article): bool
    {
        // Super Admin dan Editor bisa edit semua artikel
        if ($this->canManageAllArticles()) {
            return true;
        }
        
        // Penulis hanya bisa edit artikel sendiri
        if ($this->isPenulis() && $article->author_id === $this->id) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if user can delete specific article.
     */
    public function canDeleteArticle($article): bool
    {
        // Hanya Super Admin dan Editor yang bisa delete
        if ($this->hasRole(['super_admin', 'admin', 'editor'])) {
            return true;
        }
        
        // Penulis bisa delete artikel sendiri yang masih draft
        if ($this->isPenulis() && $article->author_id === $this->id && $article->status === 'draft') {
            return true;
        }
        
        return false;
    }

    /**
     * Get articles authored by this user.
     */
    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    /**
     * Get articles published by this user.
     */
    public function publishedArticles()
    {
        return $this->hasMany(Article::class, 'published_by');
    }

    // ===== SOCIAL LOGIN METHODS =====

    /**
     * Check if user has any social accounts linked.
     */
    public function hasSocialAccounts(): bool
    {
        return $this->google_id !== null || 
               $this->facebook_id !== null || 
               $this->github_id !== null;
    }

    /**
     * Check if user has a specific provider linked.
     */
    public function hasProviderLinked(string $provider): bool
    {
        $field = $provider . '_id';
        return $this->$field !== null;
    }

    /**
     * Get all linked social providers.
     */
    public function getLinkedProviders(): array
    {
        $providers = [];
        if ($this->google_id) $providers[] = 'google';
        if ($this->facebook_id) $providers[] = 'facebook';
        if ($this->github_id) $providers[] = 'github';
        return $providers;
    }

    /**
     * Get the user's profile avatar (prefer social avatar over gravatar).
     */
    public function getAvatarUrl(): string
    {
        if ($this->provider_avatar) {
            return $this->provider_avatar;
        }
        
        // Fallback to Gravatar
        $hash = md5(strtolower(trim($this->email)));
        return "https://www.gravatar.com/avatar/{$hash}?d=identicon&s=200";
    }
}