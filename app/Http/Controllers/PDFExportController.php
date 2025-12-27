<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\Article;
use App\Models\TeacherClass;
use App\Models\Grade;
use Dompdf\Dompdf;
use Dompdf\Options;

class PDFExportController extends Controller
{
    /**
     * Initialize DomPDF with configuration.
     */
    private function initializePDF(): Dompdf
    {
        $options = new Options();
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $dompdf = new Dompdf($options);
        return $dompdf;
    }

    /**
     * Export teacher profile as PDF.
     */
    public function exportTeacherProfile(Request $request)
    {
        // Verify user has permission
        if (!Auth::user()->isTeacher() && !Auth::user()->isSuperAdmin()) {
            abort(403, 'Unauthorized access to teacher profile export');
        }

        $teacherId = $request->input('teacher_id', Auth::id());
        $teacher = User::with(['teacherProfile', 'teacherProfile.subjects'])->findOrFail($teacherId);
        
        if (!$teacher->teacherProfile) {
            abort(404, 'Teacher profile not found');
        }

        // Generate HTML content
        $html = $this->generateTeacherProfileHTML($teacher);
        
        // Create PDF
        $dompdf = $this->initializePDF();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $filename = 'teacher_profile_' . $teacher->name . '_' . date('Y-m-d') . '.pdf';
        
        return response($dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Export class report as PDF.
     */
    public function exportClassReport(Request $request, $classId)
    {
        $user = Auth::user();
        $class = TeacherClass::with(['teacher', 'subject', 'students', 'grades'])->findOrFail($classId);
        
        // Verify access permissions
        if (!$user->isSuperAdmin() && $class->teacher_id !== $user->id) {
            abort(403, 'Unauthorized access to class report');
        }

        // Generate HTML content
        $html = $this->generateClassReportHTML($class);
        
        // Create PDF
        $dompdf = $this->initializePDF();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $filename = 'class_report_' . str_replace(' ', '_', $class->name) . '_' . date('Y-m-d') . '.pdf';
        
        return response($dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Export student transcript as PDF.
     */
    public function exportStudentTranscript(Request $request, $studentId)
    {
        $user = Auth::user();
        $student = User::with(['grades.teacherClass.subject'])->findOrFail($studentId);
        
        // Verify access permissions
        if (!$user->isSuperAdmin() && !$user->isTeacher() && $user->id !== $studentId) {
            abort(403, 'Unauthorized access to student transcript');
        }

        // Generate HTML content
        $html = $this->generateStudentTranscriptHTML($student);
        
        // Create PDF
        $dompdf = $this->initializePDF();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $filename = 'transcript_' . str_replace(' ', '_', $student->name) . '_' . date('Y-m-d') . '.pdf';
        
        return response($dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Export article as PDF.
     */
    public function exportArticle(Request $request, $articleId)
    {
        $article = Article::with(['author', 'category'])->findOrFail($articleId);
        
        // Only published articles can be exported by non-admin users
        $user = Auth::user();
        if (!$user->isSuperAdmin() && !$user->isEditor() && $article->status !== 'published') {
            abort(403, 'Article not available for export');
        }

        // Generate HTML content
        $html = $this->generateArticleHTML($article);
        
        // Create PDF
        $dompdf = $this->initializePDF();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $filename = 'article_' . $article->slug . '_' . date('Y-m-d') . '.pdf';
        
        return response($dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Generate teacher profile HTML template.
     */
    private function generateTeacherProfileHTML(User $teacher): string
    {
        $profile = $teacher->teacherProfile;
        
        return "
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Teacher Profile - {$teacher->name}</title>
            <style>
                body { 
                    font-family: DejaVu Sans, sans-serif; 
                    margin: 30px; 
                    color: #333; 
                    line-height: 1.6;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #2563eb;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                }
                .section {
                    margin: 25px 0;
                    page-break-inside: avoid;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #2563eb;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                }
                .info-row {
                    display: flex;
                    margin: 8px 0;
                }
                .label {
                    width: 150px;
                    font-weight: bold;
                    color: #4b5563;
                }
                .value {
                    flex: 1;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                th, td {
                    border: 1px solid #d1d5db;
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #f9fafb;
                    font-weight: bold;
                }
                .footer {
                    position: fixed;
                    bottom: 20px;
                    right: 30px;
                    font-size: 10px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>TEACHER PROFILE</h1>
                <h2>{$teacher->name}</h2>
                <p>BQ Islamic Boarding School</p>
            </div>

            <div class='section'>
                <div class='section-title'>Personal Information</div>
                <div class='info-row'>
                    <span class='label'>Full Name:</span>
                    <span class='value'>{$teacher->name}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Email:</span>
                    <span class='value'>{$teacher->email}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Phone:</span>
                    <span class='value'>{$profile->phone}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Address:</span>
                    <span class='value'>{$profile->address}</span>
                </div>
            </div>

            <div class='section'>
                <div class='section-title'>Professional Information</div>
                <div class='info-row'>
                    <span class='label'>Employee ID:</span>
                    <span class='value'>{$profile->employee_id}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Qualification:</span>
                    <span class='value'>{$profile->qualification}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Experience:</span>
                    <span class='value'>{$profile->experience_years} years</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Specialization:</span>
                    <span class='value'>{$profile->specialization}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Max Classes:</span>
                    <span class='value'>{$profile->max_classes_capacity}</span>
                </div>
            </div>

            <div class='section'>
                <div class='section-title'>Subjects Authorized to Teach</div>
                <table>
                    <thead>
                        <tr>
                            <th>Subject Name</th>
                            <th>Grade Level</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>";
        
        foreach ($profile->subjects as $subject) {
            $html .= "
                        <tr>
                            <td>{$subject->name}</td>
                            <td>{$subject->grade_level}</td>
                            <td>{$subject->description}</td>
                        </tr>";
        }
        
        $html .= "
                    </tbody>
                </table>
            </div>

            <div class='footer'>
                Generated on " . date('Y-m-d H:i:s') . " | BQ Islamic Boarding School
            </div>
        </body>
        </html>";
        
        return $html;
    }

    /**
     * Generate class report HTML template.
     */
    private function generateClassReportHTML($class): string
    {
        return "
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Class Report - {$class->name}</title>
            <style>
                body { font-family: DejaVu Sans, sans-serif; margin: 30px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #2563eb; margin-bottom: 20px; padding-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>CLASS REPORT</h1>
                <h2>{$class->name}</h2>
                <p>Teacher: {$class->teacher->name} | Subject: {$class->subject->name}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Latest Grade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>";
        
        foreach ($class->students as $student) {
            $latestGrade = $student->grades->where('teacher_class_id', $class->id)->sortByDesc('created_at')->first();
            $gradeValue = $latestGrade ? $latestGrade->value : 'N/A';
            $status = $latestGrade ? ($latestGrade->value >= 75 ? 'Pass' : 'Needs Improvement') : 'No Grade';
            
            $html .= "
                    <tr>
                        <td>{$student->name}</td>
                        <td>{$gradeValue}</td>
                        <td>{$status}</td>
                    </tr>";
        }
        
        $html .= "
                </tbody>
            </table>
            <p style='margin-top: 30px; text-align: center; font-size: 12px; color: #666;'>
                Generated on " . date('Y-m-d H:i:s') . "
            </p>
        </body>
        </html>";
        
        return $html;
    }

    /**
     * Generate student transcript HTML template.
     */
    private function generateStudentTranscriptHTML($student): string
    {
        // Implementation similar to class report but focused on individual student grades
        return "<html><head><title>Student Transcript</title></head><body><h1>Transcript for {$student->name}</h1><p>Feature under development</p></body></html>";
    }

    /**
     * Generate article HTML template.
     */
    private function generateArticleHTML($article): string
    {
        return "
        <html>
        <head>
            <meta charset='utf-8'>
            <title>{$article->title}</title>
            <style>
                body { font-family: DejaVu Sans, sans-serif; margin: 40px; color: #333; line-height: 1.8; }
                .header { text-align: center; border-bottom: 2px solid #2563eb; margin-bottom: 30px; padding-bottom: 20px; }
                .meta { color: #666; font-size: 12px; margin-bottom: 30px; }
                .content { font-size: 14px; }
                h1, h2, h3 { color: #2563eb; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>{$article->title}</h1>
                <div class='meta'>
                    Author: {$article->author->name} | 
                    Category: {$article->category->name} | 
                    Published: " . $article->published_at?->format('Y-m-d') . "
                </div>
            </div>
            <div class='content'>
                " . nl2br(strip_tags($article->content)) . "
            </div>
        </body>
        </html>";
    }
}
