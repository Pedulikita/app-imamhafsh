<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Question;
use App\Models\ExamAttempt;
use App\Models\TeacherClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExamController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get teacher's classes
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get();
        
        $classIds = $teacherClasses->pluck('id');
        
        // Get exams for teacher's classes
        $exams = Exam::whereIn('teacher_class_id', $classIds)
                     ->with(['teacherClass.grade', 'teacherClass.subject', 'questions', 'attempts'])
                     ->orderBy('created_at', 'desc')
                     ->get()
                     ->map(function($exam) {
                         return [
                             'id' => $exam->id,
                             'title' => $exam->title,
                             'subject' => $exam->teacherClass->subject->name ?? 'Unknown',
                             'class' => $exam->teacherClass->class_name ?? 'Unknown',
                             'type' => $exam->type,
                             'start_time' => $exam->start_time,
                             'end_time' => $exam->end_time,
                             'duration_minutes' => $exam->duration_minutes,
                             'total_questions' => $exam->total_questions,
                             'total_points' => $exam->total_points,
                             'is_published' => $exam->is_published,
                             'status' => $exam->isActive() ? 'active' : ($exam->isUpcoming() ? 'upcoming' : 'past'),
                             'attempts_count' => $exam->attempts->count(),
                             'students_completed' => $exam->attempts()->where('status', 'submitted')->count(),
                         ];
                     });

        return Inertia::render('Teacher/Exams/Index', [
            'exams' => $exams,
            'teacher_classes' => $teacherClasses->map(function($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->class_name,
                    'subject' => $class->subject->name ?? 'Unknown',
                    'grade' => $class->grade->name ?? 'Unknown',
                ];
            }),
            'statistics' => [
                'total_exams' => $exams->count(),
                'active_exams' => $exams->where('status', 'active')->count(),
                'upcoming_exams' => $exams->where('status', 'upcoming')->count(),
                'total_attempts' => $exams->sum('attempts_count'),
            ]
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get()
                                     ->map(function($class) {
                                         return [
                                             'id' => $class->id,
                                             'name' => $class->class_name,
                                             'subject' => $class->subject->name ?? 'Unknown',
                                             'grade' => $class->grade->name ?? 'Unknown',
                                         ];
                                     });

        return Inertia::render('Teacher/Exams/Create', [
            'teacher_classes' => $teacherClasses,
            'subjects' => Subject::active()->get(['id', 'name']),
            'exam_types' => [
                'quiz' => 'Quiz',
                'mid_exam' => 'Ujian Tengah Semester',
                'final_exam' => 'Ujian Akhir Semester',
                'assignment' => 'Tugas'
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'type' => 'required|in:quiz,mid_exam,final_exam,assignment',
            'duration_minutes' => 'required|integer|min:1|max:480',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'allow_retake' => 'boolean',
            'max_attempts' => 'required|integer|min:1|max:5',
            'show_results' => 'boolean',
        ]);

        $exam = Exam::create([
            'teacher_class_id' => $request->teacher_class_id,
            'title' => $request->title,
            'description' => $request->description,
            'subject' => $request->subject,
            'type' => $request->type,
            'duration_minutes' => $request->duration_minutes,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'allow_retake' => $request->boolean('allow_retake'),
            'max_attempts' => $request->max_attempts,
            'show_results' => $request->boolean('show_results'),
            'settings' => json_encode([
                'shuffle_questions' => $request->boolean('shuffle_questions', false),
                'show_one_question' => $request->boolean('show_one_question', true),
            ])
        ]);

        return redirect()->route('teacher.exams.questions', $exam)
                        ->with('success', 'Ujian berhasil dibuat. Silakan tambahkan soal.');
    }

    public function show(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $exam->load(['teacherClass.grade', 'teacherClass.subject', 'questions', 'attempts.student']);

        return Inertia::render('Teacher/Exams/Show', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'subject' => $exam->subject,
                'class' => $exam->teacherClass->class_name ?? 'Unknown',
                'grade' => $exam->teacherClass->grade->name ?? 'Unknown',
                'type' => $exam->type,
                'start_time' => $exam->start_time,
                'end_time' => $exam->end_time,
                'duration_minutes' => $exam->duration_minutes,
                'total_questions' => $exam->total_questions,
                'total_points' => $exam->total_points,
                'is_published' => $exam->is_published,
                'allow_retake' => $exam->allow_retake,
                'max_attempts' => $exam->max_attempts,
                'show_results' => $exam->show_results,
                'status' => $exam->isActive() ? 'active' : ($exam->isUpcoming() ? 'upcoming' : 'past'),
                'attempts_count' => $exam->attempts->count(),
                'students_completed' => $exam->attempts()->where('status', 'submitted')->count(),
            ],
            'questions' => $exam->questions->map(function($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'type' => $question->type,
                    'points' => $question->points,
                    'order' => $question->order,
                ];
            }),
            'recent_attempts' => $exam->attempts()
                                    ->with('student')
                                    ->latest()
                                    ->take(5)
                                    ->get()
                                    ->map(function($attempt) {
                                        return [
                                            'id' => $attempt->id,
                                            'student_name' => $attempt->student->name,
                                            'status' => $attempt->status,
                                            'score' => $attempt->score,
                                            'percentage' => $attempt->percentage,
                                            'submitted_at' => $attempt->submitted_at,
                                        ];
                                    })
        ]);
    }

    public function edit(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $user = Auth::user();
        
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get()
                                     ->map(function($class) {
                                         return [
                                             'id' => $class->id,
                                             'name' => $class->class_name,
                                             'subject' => $class->subject->name ?? 'Unknown',
                                             'grade' => $class->grade->name ?? 'Unknown',
                                         ];
                                     });

        return Inertia::render('Teacher/Exams/Edit', [
            'exam' => [
                'id' => $exam->id,
                'teacher_class_id' => $exam->teacher_class_id,
                'title' => $exam->title,
                'description' => $exam->description,
                'subject' => $exam->subject,
                'type' => $exam->type,
                'duration_minutes' => $exam->duration_minutes,
                'start_time' => $exam->start_time->format('Y-m-d\TH:i'),
                'end_time' => $exam->end_time->format('Y-m-d\TH:i'),
                'allow_retake' => $exam->allow_retake,
                'max_attempts' => $exam->max_attempts,
                'show_results' => $exam->show_results,
                'is_published' => $exam->is_published,
            ],
            'teacher_classes' => $teacherClasses,
            'subjects' => Subject::active()->get(['id', 'name']),
            'exam_types' => [
                'quiz' => 'Quiz',
                'mid_exam' => 'Ujian Tengah Semester',
                'final_exam' => 'Ujian Akhir Semester',
                'assignment' => 'Tugas'
            ]
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'type' => 'required|in:quiz,mid_exam,final_exam,assignment',
            'duration_minutes' => 'required|integer|min:1|max:480',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'allow_retake' => 'boolean',
            'max_attempts' => 'required|integer|min:1|max:5',
            'show_results' => 'boolean',
        ]);

        // Check if teacher owns the new class
        $teacherClass = TeacherClass::findOrFail($request->teacher_class_id);
        if ($teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $exam->update([
            'teacher_class_id' => $request->teacher_class_id,
            'title' => $request->title,
            'description' => $request->description,
            'subject' => $request->subject,
            'type' => $request->type,
            'duration_minutes' => $request->duration_minutes,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'allow_retake' => $request->boolean('allow_retake'),
            'max_attempts' => $request->max_attempts,
            'show_results' => $request->boolean('show_results'),
        ]);

        return redirect()->route('teacher.exams.show', $exam)
                        ->with('success', 'Ujian berhasil diupdate.');
    }

    public function destroy(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        // Check if exam has attempts
        if ($exam->attempts()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus ujian yang sudah dikerjakan siswa.');
        }

        $exam->delete();

        return redirect()->route('teacher.exams.index')
                        ->with('success', 'Ujian berhasil dihapus.');
    }

    public function questions(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $questions = $exam->questions()
                         ->orderBy('order')
                         ->get()
                         ->map(function($question) {
                             return [
                                 'id' => $question->id,
                                 'question_text' => $question->question_text,
                                 'type' => $question->type,
                                 'options' => $question->options,
                                 'correct_answer' => $question->correct_answer,
                                 'points' => $question->points,
                                 'order' => $question->order,
                             ];
                         });

        return Inertia::render('Teacher/Exams/Questions', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'subject' => $exam->subject,
                'total_questions' => $exam->total_questions,
                'total_points' => $exam->total_points,
                'is_published' => $exam->is_published,
            ],
            'questions' => $questions,
            'question_types' => [
                'multiple_choice' => 'Pilihan Ganda',
                'essay' => 'Essay',
                'true_false' => 'Benar/Salah',
                'fill_blank' => 'Isian'
            ]
        ]);
    }

    public function storeQuestion(Request $request, Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:multiple_choice,essay,true_false,fill_blank',
            'options' => 'nullable|array',
            'correct_answer' => 'required|string',
            'points' => 'required|numeric|min:0.1|max:100',
            'explanation' => 'nullable|string',
        ]);

        $question = Question::create([
            'exam_id' => $exam->id,
            'question_text' => $request->question_text,
            'type' => $request->type,
            'options' => $request->options,
            'correct_answer' => $request->correct_answer,
            'points' => $request->points,
            'explanation' => $request->explanation,
            'order' => $exam->questions()->max('order') + 1,
        ]);

        // Update exam totals
        $exam->calculateTotalPoints();

        return back()->with('success', 'Soal berhasil ditambahkan.');
    }

    public function publish(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        if ($exam->questions()->count() === 0) {
            return back()->with('error', 'Tidak dapat mempublish ujian tanpa soal.');
        }

        $exam->update(['is_published' => true]);
        $exam->calculateTotalPoints();

        return back()->with('success', 'Ujian berhasil dipublish dan dapat dikerjakan siswa.');
    }

    public function results(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $attempts = ExamAttempt::where('exam_id', $exam->id)
                              ->with(['student', 'studentAnswers.question'])
                              ->orderBy('submitted_at', 'desc')
                              ->get()
                              ->map(function($attempt) {
                                  return [
                                      'id' => $attempt->id,
                                      'student_name' => $attempt->student->name,
                                      'student_id' => $attempt->student->student_id ?? $attempt->student->id,
                                      'attempt_number' => $attempt->attempt_number,
                                      'status' => $attempt->status,
                                      'score' => $attempt->score,
                                      'percentage' => $attempt->percentage,
                                      'grade' => $attempt->getGrade(),
                                      'time_spent' => $attempt->time_spent_minutes,
                                      'submitted_at' => $attempt->submitted_at,
                                      'needs_grading' => $attempt->studentAnswers()
                                                               ->whereHas('question', function($q) {
                                                                   $q->where('type', 'essay');
                                                               })
                                                               ->whereNull('points_earned')
                                                               ->exists(),
                                  ];
                              });

        $statistics = [
            'total_attempts' => $attempts->count(),
            'completed' => $attempts->where('status', 'submitted')->count(),
            'in_progress' => $attempts->where('status', 'in_progress')->count(),
            'average_score' => $attempts->where('status', '!=', 'in_progress')->avg('percentage'),
            'highest_score' => $attempts->where('status', '!=', 'in_progress')->max('percentage'),
            'lowest_score' => $attempts->where('status', '!=', 'in_progress')->min('percentage'),
            'needs_grading' => $attempts->where('needs_grading', true)->count(),
        ];

        return Inertia::render('Teacher/Exams/Results', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'subject' => $exam->subject,
                'total_points' => $exam->total_points,
                'start_time' => $exam->start_time,
                'end_time' => $exam->end_time,
            ],
            'attempts' => $attempts,
            'statistics' => $statistics,
        ]);
    }

    public function analytics(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        // Question analysis
        $questionAnalysis = $exam->questions()
                                ->with(['studentAnswers' => function($query) {
                                    $query->whereHas('examAttempt', function($q) {
                                        $q->where('status', 'submitted');
                                    });
                                }])
                                ->get()
                                ->map(function($question) {
                                    $answers = $question->studentAnswers;
                                    $totalAnswers = $answers->count();
                                    
                                    if ($totalAnswers === 0) {
                                        return [
                                            'question_id' => $question->id,
                                            'question_text' => substr($question->question_text, 0, 100) . '...',
                                            'type' => $question->type,
                                            'total_answers' => 0,
                                            'correct_answers' => 0,
                                            'difficulty' => 'N/A',
                                            'average_points' => 0,
                                        ];
                                    }

                                    $correctAnswers = $answers->where('is_correct', true)->count();
                                    $averagePoints = $answers->avg('points_earned');
                                    $difficultyPercent = ($correctAnswers / $totalAnswers) * 100;
                                    
                                    $difficulty = 'Easy';
                                    if ($difficultyPercent < 60) $difficulty = 'Hard';
                                    elseif ($difficultyPercent < 80) $difficulty = 'Medium';

                                    return [
                                        'question_id' => $question->id,
                                        'question_text' => substr($question->question_text, 0, 100) . '...',
                                        'type' => $question->type,
                                        'total_answers' => $totalAnswers,
                                        'correct_answers' => $correctAnswers,
                                        'correct_percentage' => $difficultyPercent,
                                        'difficulty' => $difficulty,
                                        'average_points' => round($averagePoints, 2),
                                        'max_points' => $question->points,
                                    ];
                                });

        // Score distribution
        $attempts = $exam->attempts()->where('status', 'submitted')->get();
        $scoreDistribution = [
            'A (90-100)' => $attempts->where('percentage', '>=', 90)->count(),
            'B (80-89)' => $attempts->whereBetween('percentage', [80, 89])->count(),
            'C (70-79)' => $attempts->whereBetween('percentage', [70, 79])->count(),
            'D (60-69)' => $attempts->whereBetween('percentage', [60, 69])->count(),
            'F (0-59)' => $attempts->where('percentage', '<', 60)->count(),
        ];

        return Inertia::render('Teacher/Exams/Analytics', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'subject' => $exam->subject,
                'total_questions' => $exam->total_questions,
                'total_points' => $exam->total_points,
            ],
            'question_analysis' => $questionAnalysis,
            'score_distribution' => $scoreDistribution,
            'overall_statistics' => [
                'total_attempts' => $attempts->count(),
                'average_score' => round($attempts->avg('percentage'), 2),
                'median_score' => $attempts->median('percentage'),
                'standard_deviation' => $attempts->count() > 1 ? round($attempts->std('percentage'), 2) : 0,
                'completion_rate' => $exam->teacherClass->students->count() > 0 
                    ? round(($attempts->count() / $exam->teacherClass->students->count()) * 100, 2) 
                    : 0,
            ]
        ]);
    }

    public function updateQuestion(Request $request, Question $question)
    {
        // Ensure teacher owns this question's exam
        if ($question->exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:multiple_choice,essay,true_false,fill_blank',
            'options' => 'nullable|array',
            'correct_answer' => 'required|string',
            'points' => 'required|numeric|min:0.1|max:100',
            'explanation' => 'nullable|string',
        ]);

        $question->update([
            'question_text' => $request->question_text,
            'type' => $request->type,
            'options' => $request->options,
            'correct_answer' => $request->correct_answer,
            'points' => $request->points,
            'explanation' => $request->explanation,
        ]);

        // Update exam totals
        $question->exam->calculateTotalPoints();

        return back()->with('success', 'Soal berhasil diupdate.');
    }

    public function destroyQuestion(Question $question)
    {
        // Ensure teacher owns this question's exam
        if ($question->exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $exam = $question->exam;
        $question->delete();

        // Update exam totals
        $exam->calculateTotalPoints();

        return back()->with('success', 'Soal berhasil dihapus.');
    }

    public function unpublish(Exam $exam)
    {
        // Ensure teacher owns this exam
        if ($exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        // Check if there are active attempts
        if ($exam->attempts()->where('status', 'in_progress')->exists()) {
            return back()->with('error', 'Tidak dapat membatalkan publish ujian yang sedang dikerjakan siswa.');
        }

        $exam->update(['is_published' => false]);

        return back()->with('success', 'Ujian berhasil dibatalkan publish.');
    }

    public function viewAttempt(ExamAttempt $attempt)
    {
        // Ensure teacher owns this exam
        if ($attempt->exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $attempt->load(['student', 'studentAnswers.question', 'exam']);

        return Inertia::render('Teacher/Exams/ViewAttempt', [
            'attempt' => [
                'id' => $attempt->id,
                'student_name' => $attempt->student->name,
                'student_id' => $attempt->student->student_id ?? $attempt->student->id,
                'exam_title' => $attempt->exam->title,
                'attempt_number' => $attempt->attempt_number,
                'status' => $attempt->status,
                'score' => $attempt->score,
                'percentage' => $attempt->percentage,
                'grade' => $attempt->getGrade(),
                'time_spent' => $attempt->time_spent_minutes,
                'started_at' => $attempt->started_at,
                'submitted_at' => $attempt->submitted_at,
            ],
            'answers' => $attempt->studentAnswers->map(function($answer) {
                return [
                    'id' => $answer->id,
                    'question_text' => $answer->question->question_text,
                    'question_type' => $answer->question->type,
                    'question_points' => $answer->question->points,
                    'student_answer' => $answer->getFormattedAnswer(),
                    'correct_answer' => $answer->question->correct_answer,
                    'points_earned' => $answer->points_earned,
                    'is_correct' => $answer->is_correct,
                    'teacher_feedback' => $answer->teacher_feedback,
                    'needs_grading' => $answer->question->type === 'essay' && is_null($answer->points_earned),
                ];
            }),
        ]);
    }

    public function gradeAttempt(Request $request, ExamAttempt $attempt)
    {
        // Ensure teacher owns this exam
        if ($attempt->exam->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'grades' => 'required|array',
            'grades.*.answer_id' => 'required|exists:student_answers,id',
            'grades.*.points_earned' => 'required|numeric|min:0',
            'grades.*.teacher_feedback' => 'nullable|string',
        ]);

        foreach ($request->grades as $gradeData) {
            $answer = StudentAnswer::findOrFail($gradeData['answer_id']);
            
            // Ensure this answer belongs to this attempt
            if ($answer->exam_attempt_id !== $attempt->id) {
                continue;
            }

            $answer->update([
                'points_earned' => $gradeData['points_earned'],
                'teacher_feedback' => $gradeData['teacher_feedback'] ?? null,
                'is_correct' => $gradeData['points_earned'] > 0,
            ]);
        }

        // Recalculate attempt score
        $totalScore = $attempt->studentAnswers()->sum('points_earned');
        $totalPoints = $attempt->exam->total_points;
        
        $attempt->update([
            'score' => $totalScore,
            'percentage' => $totalPoints > 0 ? ($totalScore / $totalPoints) * 100 : 0,
            'status' => 'graded'
        ]);

        return back()->with('success', 'Ujian berhasil dinilai.');
    }

    /**
     * Show question bank overview for all exams
     */
    public function questionBank()
    {
        $user = Auth::user();
        
        // Get teacher's classes
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get();
        
        $classIds = $teacherClasses->pluck('id');
        
        // Get all questions from teacher's exams
        $questions = Question::whereHas('exam', function($query) use ($classIds) {
                                $query->whereIn('teacher_class_id', $classIds);
                            })
                            ->with(['exam.teacherClass.subject', 'exam.teacherClass'])
                            ->orderBy('created_at', 'desc')
                            ->paginate(20);
        
        // Get statistics
        $stats = [
            'total_questions' => Question::whereHas('exam', function($query) use ($classIds) {
                $query->whereIn('teacher_class_id', $classIds);
            })->count(),
            'by_type' => Question::whereHas('exam', function($query) use ($classIds) {
                $query->whereIn('teacher_class_id', $classIds);
            })->select('type', DB::raw('count(*) as total'))
              ->groupBy('type')
              ->pluck('total', 'type')
              ->toArray(),
            'by_subject' => Question::whereHas('exam', function($query) use ($classIds) {
                $query->whereIn('teacher_class_id', $classIds);
            })->join('exams', 'questions.exam_id', '=', 'exams.id')
              ->join('teacher_classes', 'exams.teacher_class_id', '=', 'teacher_classes.id')
              ->join('subjects', 'teacher_classes.subject_id', '=', 'subjects.id')
              ->select('subjects.name', DB::raw('count(*) as total'))
              ->groupBy('subjects.name')
              ->pluck('total', 'name')
              ->toArray()
        ];

        return Inertia::render('Teacher/Exams/QuestionBank', [
            'questions' => $questions,
            'stats' => $stats,
            'teacherClasses' => $teacherClasses
        ]);
    }

    /**
     * Show results overview for all exams
     */
    public function resultsOverview()
    {
        $user = Auth::user();
        
        // Get teacher's classes
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get();
        
        $classIds = $teacherClasses->pluck('id');
        
        // Get all exam attempts from teacher's exams
        $attempts = ExamAttempt::whereHas('exam', function($query) use ($classIds) {
                                    $query->whereIn('teacher_class_id', $classIds);
                                })
                                ->with(['exam.teacherClass.subject', 'student', 'exam'])
                                ->where('status', 'submitted')
                                ->orderBy('submitted_at', 'desc')
                                ->paginate(20);

        // Get overall statistics
        $stats = [
            'total_attempts' => ExamAttempt::whereHas('exam', function($query) use ($classIds) {
                $query->whereIn('teacher_class_id', $classIds);
            })->where('status', 'submitted')->count(),
            
            'average_score' => ExamAttempt::whereHas('exam', function($query) use ($classIds) {
                $query->whereIn('teacher_class_id', $classIds);
            })->where('status', 'submitted')
              ->whereNotNull('score')
              ->avg('score'),
              
            'pending_grading' => ExamAttempt::whereHas('exam', function($query) use ($classIds) {
                $query->whereIn('teacher_class_id', $classIds);
            })->where('status', 'submitted')
              ->whereNull('score')
              ->count(),
              
            'completion_rate' => $this->getCompletionRate($classIds)
        ];

        return Inertia::render('Teacher/Exams/ResultsOverview', [
            'attempts' => $attempts,
            'stats' => $stats,
            'teacherClasses' => $teacherClasses
        ]);
    }

    private function getCompletionRate($classIds)
    {
        $totalExams = Exam::whereIn('teacher_class_id', $classIds)
                          ->where('is_published', true)
                          ->count();
                          
        if ($totalExams == 0) return 100;
        
        $completedExams = Exam::whereIn('teacher_class_id', $classIds)
                             ->where('is_published', true)
                             ->whereHas('attempts', function($query) {
                                 $query->where('status', 'submitted');
                             })->count();
                             
        return round(($completedExams / $totalExams) * 100, 2);
    }
}