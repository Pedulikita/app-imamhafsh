<?php

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

Route::get('/test-user-edit/{user}', function(User $user) {
    try {
        $user->load('roles');
        $roles = Role::all();
        
        return response()->json([
            'success' => true,
            'user' => $user,
            'roles' => $roles,
            'message' => 'User edit data loaded successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
});