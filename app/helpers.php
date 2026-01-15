<?php

if (!function_exists('getSetting')) {
    function getSetting(string $key, string $default = ''): string
    {
        return \App\Models\SiteSetting::get($key, $default);
    }
}

if (!function_exists('getSettingsByGroup')) {
    function getSettingsByGroup(string $group): array
    {
        return \App\Models\SiteSetting::getByGroup($group);
    }
}