<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display chat interface
     */
    public function index()
    {
        $user = Auth::user();
        $conversations = Conversation::where('teacher_id', $user->id)
            ->orWhere('parent_id', $user->id)
            ->with(['teacher', 'parent', 'student', 'messages' => function($query) {
                $query->latest()->first();
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Show specific conversation
     */
    public function show(Conversation $conversation)
    {
        $user = Auth::user();
        
        // Check if user is participant in conversation
        if ($conversation->teacher_id !== $user->id && $conversation->parent_id !== $user->id) {
            abort(403);
        }

        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('Chat/Show', [
            'conversation' => $conversation->load(['teacher', 'parent', 'student']),
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request, Conversation $conversation)
    {
        $user = Auth::user();
        
        // Check if user is participant in conversation
        if ($conversation->teacher_id !== $user->id && $conversation->parent_id !== $user->id) {
            abort(403);
        }

        $request->validate([
            'message' => 'required|string|max:1000',
            'message_type' => 'in:text,image,file',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message' => $request->message,
            'message_type' => $request->message_type ?? 'text',
        ]);

        // Update conversation last_message_at
        $conversation->update([
            'last_message_at' => now(),
        ]);

        // Broadcast the message
        broadcast(new MessageSent($message));

        return response()->json([
            'message' => $message->load('sender'),
            'success' => true,
        ]);
    }

    /**
     * Create conversation between teacher and parent
     */
    public function createConversation(Request $request)
    {
        $request->validate([
            'parent_id' => 'required|exists:users,id',
            'student_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();

        // Check if conversation already exists
        $existingConversation = Conversation::where('teacher_id', $user->id)
            ->where('parent_id', $request->parent_id)
            ->where('student_id', $request->student_id)
            ->first();

        if ($existingConversation) {
            return redirect()->route('chat.show', $existingConversation);
        }

        $conversation = Conversation::create([
            'teacher_id' => $user->id,
            'parent_id' => $request->parent_id,
            'student_id' => $request->student_id,
            'status' => 'active',
        ]);

        return redirect()->route('chat.show', $conversation);
    }

    /**
     * Get conversations for API
     */
    public function getConversations()
    {
        $user = Auth::user();
        
        $conversations = Conversation::where('teacher_id', $user->id)
            ->orWhere('parent_id', $user->id)
            ->with(['teacher', 'parent', 'student'])
            ->withCount(['messages as unread_count' => function($query) use ($user) {
                $query->where('sender_id', '!=', $user->id)
                      ->whereNull('read_at');
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json($conversations);
    }

    /**
     * Mark conversation as read
     */
    public function markAsRead(Conversation $conversation)
    {
        $user = Auth::user();
        
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
