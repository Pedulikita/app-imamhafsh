<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FileManagerController extends Controller
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = public_path();
    }

    /**
     * Display file manager interface.
     */
    public function index(Request $request): Response
    {
        $path = $request->query('path', '');
        $fullPath = $this->getFullPath($path);

        if (!File::exists($fullPath)) {
            abort(404, 'Path not found');
        }

        $items = $this->getDirectoryContents($fullPath, $path);

        return Inertia::render('FileManager/Index', [
            'currentPath' => $path,
            'items' => $items,
            'breadcrumbs' => $this->getBreadcrumbs($path),
        ]);
    }

    /**
     * Create a new folder.
     */
    public function createFolder(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'name' => 'required|string|max:255',
        ]);

        $fullPath = $this->getFullPath($request->path);
        $newFolderPath = $fullPath . '/' . $request->name;

        if (File::exists($newFolderPath)) {
            return back()->with('error', 'Folder already exists');
        }

        File::makeDirectory($newFolderPath, 0755, true);

        return back()->with('success', 'Folder created successfully');
    }

    /**
     * Upload files.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'files.*' => 'required|file|max:10240', // Max 10MB
        ]);

        $path = $this->getFullPath($request->path);
        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $filename = $file->getClientOriginalName();
            $file->move($path, $filename);
            $uploaded[] = $filename;
        }

        return back()->with('success', count($uploaded) . ' file(s) uploaded successfully');
    }

    /**
     * Delete file or folder.
     */
    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $fullPath = $this->getFullPath($request->path);

        if (!File::exists($fullPath)) {
            return back()->with('error', 'File or folder not found');
        }

        if (File::isDirectory($fullPath)) {
            File::deleteDirectory($fullPath);
        } else {
            File::delete($fullPath);
        }

        return back()->with('success', 'Deleted successfully');
    }

    /**
     * Rename file or folder.
     */
    public function rename(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'newName' => 'required|string|max:255',
        ]);

        $fullPath = $this->getFullPath($request->path);
        $directory = dirname($fullPath);
        $newPath = $directory . '/' . $request->newName;

        if (!File::exists($fullPath)) {
            return back()->with('error', 'File or folder not found');
        }

        if (File::exists($newPath)) {
            return back()->with('error', 'A file or folder with that name already exists');
        }

        File::move($fullPath, $newPath);

        return back()->with('success', 'Renamed successfully');
    }

    /**
     * Download file.
     */
    public function download(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $fullPath = $this->getFullPath($request->path);

        if (!File::exists($fullPath) || File::isDirectory($fullPath)) {
            abort(404, 'File not found');
        }

        return response()->download($fullPath);
    }

    /**
     * Get full path from relative path.
     */
    protected function getFullPath(string $relativePath): string
    {
        $fullPath = $this->basePath . '/' . ltrim($relativePath, '/');
        
        // Security check: prevent path traversal
        if (!str_starts_with(realpath($fullPath) ?: $fullPath, realpath($this->basePath))) {
            abort(403, 'Access denied');
        }

        return $fullPath;
    }

    /**
     * Get directory contents.
     */
    protected function getDirectoryContents(string $fullPath, string $relativePath): array
    {
        if (!File::isDirectory($fullPath)) {
            return [];
        }

        $items = [];
        $files = File::files($fullPath);
        $directories = File::directories($fullPath);

        foreach ($directories as $directory) {
            $name = basename($directory);
            $items[] = [
                'name' => $name,
                'type' => 'folder',
                'path' => $relativePath ? $relativePath . '/' . $name : $name,
                'size' => null,
                'modified' => File::lastModified($directory),
            ];
        }

        foreach ($files as $file) {
            $name = basename($file);
            $items[] = [
                'name' => $name,
                'type' => 'file',
                'path' => $relativePath ? $relativePath . '/' . $name : $name,
                'size' => File::size($file),
                'modified' => File::lastModified($file),
                'extension' => File::extension($file),
            ];
        }

        return $items;
    }

    /**
     * Get breadcrumbs.
     */
    protected function getBreadcrumbs(string $path): array
    {
        if (empty($path)) {
            return [
                ['name' => 'Public', 'path' => '']
            ];
        }

        $parts = explode('/', $path);
        $breadcrumbs = [
            ['name' => 'Public', 'path' => '']
        ];

        $currentPath = '';
        foreach ($parts as $part) {
            $currentPath .= ($currentPath ? '/' : '') . $part;
            $breadcrumbs[] = [
                'name' => $part,
                'path' => $currentPath
            ];
        }

        return $breadcrumbs;
    }
}
