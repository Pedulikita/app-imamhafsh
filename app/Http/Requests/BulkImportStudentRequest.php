<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkImportStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['super_admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'students' => 'required|array|min:1',
            'students.*.name' => 'required|string|max:255',
            'students.*.email' => 'nullable|email',
            'students.*.phone' => 'nullable|string|max:20',
            'students.*.student_id' => 'required|string|max:20|distinct',
            'students.*.nis' => 'nullable|string|max:20|distinct',
            'students.*.nisn' => 'nullable|string|max:20|distinct',
            'students.*.gender' => 'required|in:male,female',
            'students.*.birth_date' => 'nullable|date|before:today',
            'students.*.birth_place' => 'nullable|string|max:255',
            'students.*.address' => 'nullable|string',
            'students.*.parent_name' => 'nullable|string|max:255',
            'students.*.parent_phone' => 'nullable|string|max:20',
            'students.*.parent_email' => 'nullable|email',
            'students.*.class_name' => 'nullable|string|max:100',
            'students.*.academic_year' => 'required|integer|min:2020|max:' . (date('Y') + 5),
        ];
    }

    public function messages(): array
    {
        return [
            'students.required' => 'No student data provided.',
            'students.*.name.required' => 'Student name is required for all records.',
            'students.*.student_id.required' => 'Student ID is required for all records.',
            'students.*.student_id.distinct' => 'Student IDs must be unique within the import.',
            'students.*.gender.required' => 'Gender is required for all students.',
            'students.*.gender.in' => 'Gender must be either male or female.',
            'students.*.academic_year.required' => 'Academic year is required for all students.',
        ];
    }
}