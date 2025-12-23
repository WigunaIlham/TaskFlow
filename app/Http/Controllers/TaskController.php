<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redirect;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        
        $tasks = Task::with(['user', 'assignee'])
            ->where('user_id', $userId)
            ->orderBy('position')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard/KanbanBoard', [
            'tasks' => $tasks,
            'stats' => [
                'total' => $tasks->count(),
                'backlog' => $tasks->where('status', 'backlog')->count(),
                'todo' => $tasks->where('status', 'todo')->count(),
                'in_progress' => $tasks->where('status', 'in_progress')->count(),
                'review' => $tasks->where('status', 'review')->count(),
                'done' => $tasks->where('status', 'done')->count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task = Task::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'todo',
            'priority' => $request->priority ?? 'medium',
        ]);

        return redirect()->route('tasks.index');
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:backlog,todo,in_progress,review,done',
            'position' => 'sometimes|integer',
        ]);

        $task->update($request->all());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}