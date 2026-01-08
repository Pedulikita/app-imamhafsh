<?php

namespace App\Policies;

use App\Models\Facility;
use App\Models\User;

class FacilityPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Facility $facility): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Facility $facility): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Facility $facility): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Facility $facility): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Facility $facility): bool
    {
        return $user->hasRole(['super_admin', 'admin', 'editor']);
    }
}
