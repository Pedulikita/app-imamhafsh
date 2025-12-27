<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Article;

class ArticleAccessMiddleware
{
    /**
     * Handle an incoming request for article access control.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string  $permission  Required permission level
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, string $permission = 'view')
    {
        $user = Auth::user();

        // Check if user is authenticated
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please login to access articles.');
        }

        // Get article from route parameters if exists
        $article = $request->route('article');
        
        // Check permission based on action
        switch ($permission) {
            case 'view':
                if (!$this->canViewArticles($user)) {
                    abort(403, 'Access denied. You don\'t have permission to view articles.');
                }
                break;
                
            case 'create':
                if (!$this->canCreateArticles($user)) {
                    abort(403, 'Access denied. You don\'t have permission to create articles.');
                }
                break;
                
            case 'edit':
                if (!$article || !$this->canEditArticle($user, $article)) {
                    abort(403, 'Access denied. You don\'t have permission to edit this article.');
                }
                break;
                
            case 'delete':
                if (!$article || !$this->canDeleteArticle($user, $article)) {
                    abort(403, 'Access denied. You don\'t have permission to delete this article.');
                }
                break;
                
            case 'publish':
                if (!$this->canPublishArticles($user)) {
                    abort(403, 'Access denied. You don\'t have permission to publish articles.');
                }
                break;
        }

        return $next($request);
    }

    /**
     * Check if user can view articles.
     */
    private function canViewArticles($user): bool
    {
        return $user->hasPermission('view_articles');
    }

    /**
     * Check if user can create articles.
     */
    private function canCreateArticles($user): bool
    {
        return $user->hasPermission('create_articles');
    }

    /**
     * Check if user can edit specific article.
     */
    private function canEditArticle($user, $article): bool
    {
        return $user->canEditArticle($article);
    }

    /**
     * Check if user can delete specific article.
     */
    private function canDeleteArticle($user, $article): bool
    {
        return $user->canDeleteArticle($article);
    }

    /**
     * Check if user can publish articles.
     */
    private function canPublishArticles($user): bool
    {
        return $user->canPublishArticles();
    }
}