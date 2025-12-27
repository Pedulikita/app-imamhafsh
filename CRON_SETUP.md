# Cron Job Setup Instructions for IMAMHAFSH.COM

## Quick Setup for Linux/Ubuntu Server

### 1. Edit Crontab
```bash
crontab -e
```

### 2. Add Laravel Scheduler (Required - Main Entry Point)
```bash
# Laravel Task Scheduler - MUST BE FIRST
* * * * * cd /var/www/imamhafsh.com && php artisan schedule:run >> /dev/null 2>&1
```

### 3. Optional: Direct Cron Jobs (if not using Laravel scheduler)
```bash
# Database backup daily at 1:00 AM
0 1 * * * cd /var/www/imamhafsh.com && php artisan backup:database --compress >> storage/logs/cron.log 2>&1

# Log cleanup weekly on Sunday at 2:00 AM  
0 2 * * 0 cd /var/www/imamhafsh.com && php artisan logs:cleanup >> storage/logs/cron.log 2>&1

# Image optimization monthly on 1st at 3:00 AM
0 3 1 * * cd /var/www/imamhafsh.com && php artisan images:optimize >> storage/logs/cron.log 2>&1

# Clear application cache daily at 5:00 AM
0 5 * * * cd /var/www/imamhafsh.com && php artisan cache:clear >> storage/logs/cron.log 2>&1

# Session cleanup daily at 4:00 AM
0 4 * * * cd /var/www/imamhafsh.com && php artisan session:gc >> storage/logs/cron.log 2>&1
```

## Windows Task Scheduler (For Windows Server)

### 1. Create Batch Files

**laravel_scheduler.bat:**
```batch
@echo off
cd /d "D:\laragon\www\imamhafsh.com"
php artisan schedule:run
```

**backup_database.bat:**
```batch
@echo off
cd /d "D:\laragon\www\imamhafsh.com"
php artisan backup:database --compress >> storage\logs\cron.log 2>&1
```

### 2. Schedule in Task Scheduler
- Open Task Scheduler
- Create Basic Task
- Set trigger (daily, weekly, etc.)
- Set action to run the batch file
- Configure to run whether user is logged on or not

## Commands Available

### Manual Execution
```bash
# Database backup
php artisan backup:database
php artisan backup:database --compress
php artisan backup:database --path=/custom/path

# Log cleanup
php artisan logs:cleanup
php artisan logs:cleanup --days=30
php artisan logs:cleanup --size=100

# Image optimization
php artisan images:optimize
php artisan images:optimize --quality=75
php artisan images:optimize --force
```

### Check Laravel Scheduler
```bash
# View scheduled tasks
php artisan schedule:list

# Run scheduler manually (for testing)
php artisan schedule:run

# Work with specific schedule
php artisan schedule:work
```

## Monitoring & Logs

### Check Cron Logs
```bash
# View cron activities
tail -f storage/logs/cron.log

# Check Laravel logs
tail -f storage/logs/laravel.log

# System cron logs (Linux)
tail -f /var/log/cron
```

### Health Check
```bash
# Check if cron is working
php artisan schedule:run --verbose

# Test individual commands
php artisan backup:database --verbose
```

## Important Notes

1. **Replace paths**: Change `/var/www/imamhafsh.com` to your actual server path
2. **Permissions**: Ensure PHP and artisan are executable
3. **Environment**: Make sure .env file is properly configured
4. **Logs**: Monitor cron.log for any issues
5. **Testing**: Test commands manually before setting up cron jobs

## Recommended Minimum Setup

For basic functionality, you only need:
```bash
# Essential - Laravel scheduler
* * * * * cd /path/to/imamhafsh.com && php artisan schedule:run >> /dev/null 2>&1
```

All other maintenance tasks are handled by the Laravel scheduler configuration in `app/Console/Kernel.php`.

## Troubleshooting

### Common Issues:
- **Path not found**: Verify the correct path to your Laravel project
- **PHP not found**: Use full PHP path like `/usr/bin/php`
- **Permission denied**: Check file permissions and ownership
- **Environment variables**: Cron runs with limited environment, may need to set PATH

### Debug Commands:
```bash
# Check PHP path
which php

# Check if artisan works
cd /path/to/project && php artisan --version

# Test cron entry manually
cd /path/to/project && php artisan schedule:run --verbose
```