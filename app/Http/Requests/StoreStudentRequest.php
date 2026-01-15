<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['super_admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email',
            'phone' => 'nullable|string|max:20',
            'student_id' => 'nullable|string|max:20|unique:students,student_id',
            'nis' => 'nullable|string|max:20|unique:students,nis',
            'nisn' => 'nullable|string|max:20|unique:students,nisn',
            'gender' => 'required|in:male,female',
            'birth_date' => 'nullable|date|before:today',
            'birth_place' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:20',
            'parent_email' => 'nullable|email',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'class_id' => 'nullable|exists:student_classes,id',
            'academic_year' => 'required|integer|min:2020|max:' . (date('Y') + 5),
            'enrollment_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,graduated,transferred',
            'religion' => 'nullable|string|max:50',
            'blood_type' => 'nullable|in:A,B,AB,O',
            'medical_notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Student name is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'student_id.unique' => 'This student ID is already taken.',
            'nis.unique' => 'This NIS number is already registered.',
            'nisn.unique' => 'This NISN number is already registered.',
            'gender.required' => 'Please select student gender.',
            'gender.in' => 'Gender must be either male or female.',
            'birth_date.before' => 'Birth date must be before today.',
            'academic_year.required' => 'Academic year is required.',
            'academic_year.min' => 'Academic year must be at least 2020.',
            'class_id.exists' => 'Selected class does not exist.',
            'status.in' => 'Invalid status selected.',
            'blood_type.in' => 'Invalid blood type selected.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->birth_date) {
            $this->merge([
                'birth_date' => date('Y-m-d', strtotime($this->birth_date))
            ]);
        }

        if ($this->enrollment_date) {
            $this->merge([
                'enrollment_date' => date('Y-m-d', strtotime($this->enrollment_date))
            ]);
        }

        // Clean phone numbers
        if ($this->phone) {
            $this->merge(['phone' => preg_replace('/[^0-9+]/', '', $this->phone)]);
        }
        
        if ($this->parent_phone) {
            $this->merge(['parent_phone' => preg_replace('/[^0-9+]/', '', $this->parent_phone)]);
        }
        
        if ($this->emergency_phone) {
            $this->merge(['emergency_phone' => preg_replace('/[^0-9+]/', '', $this->emergency_phone)]);
        }
    }
}