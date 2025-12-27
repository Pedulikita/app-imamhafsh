<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'meta_title',
        'meta_description',
        'featured_image',
        'image_metadata',
        'category',
        'category_id',
        'tags',
        'status',
        'views',
        'author_id',
        'reviewed_by',
        'published_by',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeByAuthor($query, $userId)
    {
        return $query->where('author_id', $userId);
    }

    public function incrementViews()
    {
        $this->increment('views');
    }
}
