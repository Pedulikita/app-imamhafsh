<?php
require bootstrap/app.php;

echo === CHECKING USER ROLES ===\n;

$users = App\Models\User::with(roles)->get();
foreach($users as $user) {
    echo User: {$user->email}\n;
    echo Roles: ;
    foreach($user->roles as $role) {
        echo {$role->name} ;
    }
    echo \n---\n;
}

echo \n=== AVAILABLE ROLES ===\n;
$roles = App\Models\Role::all();
foreach($roles as $role) {
    echo {$role->name} ({$role->display_name})\n;
}
