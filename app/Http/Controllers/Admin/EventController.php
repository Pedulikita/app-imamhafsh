<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => ['required', Rule::in(['Event', 'Poster'])],
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = 'storage/' . $path;
        }

        Event::create($validated);

        return redirect('/admin/events')->with('success', 'Event created successfully.');
    }

    public function edit(Event $event)
    {
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => ['required', Rule::in(['Event', 'Poster'])],
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image && file_exists(public_path($event->image))) {
                unlink(public_path($event->image));
            }
            
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = 'storage/' . $path;
        } else {
            unset($validated['image']);
        }

        $event->update($validated);

        return redirect('/admin/events')->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        if ($event->image && file_exists(public_path($event->image))) {
            unlink(public_path($event->image));
        }

        $event->delete();

        return redirect('/admin/events')->with('success', 'Event deleted successfully.');
    }
}
