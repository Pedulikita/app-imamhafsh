export interface Student {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    student_id: string;
    nis?: string;
    nisn?: string;
    gender: 'male' | 'female';
    birth_date?: string;
    birth_place?: string;
    address?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_email?: string;
    emergency_contact?: string;
    emergency_phone?: string;
    class_id?: number;
    class?: {
        id: number;
        name: string;
        grade: string;
        academic_year: number;
    };
    academic_year: number;
    enrollment_date?: string;
    status: 'active' | 'inactive' | 'graduated' | 'transferred';
    photo?: string;
    average_grade?: number;
    attendance_rate?: number;
    total_grades?: number;
    performance_status?:
        | 'excellent'
        | 'good'
        | 'satisfactory'
        | 'needs_attention';
    religion?: string;
    blood_type?: string;
    medical_notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface StudentClass {
    id: number;
    name: string;
    grade: string;
    academic_year: number;
    capacity: number;
    current_students: number;
    homeroom_teacher?: {
        id: number;
        name: string;
        email: string;
    };
    subjects?: Subject[];
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    description?: string;
    credits: number;
    teacher?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface StudentEnrollment {
    id: number;
    student_id: number;
    class_id: number;
    enrollment_date: string;
    status: 'enrolled' | 'completed' | 'dropped';
    student: Student;
    class: StudentClass;
}

export interface StudentImportData {
    name: string;
    email?: string;
    phone?: string;
    student_id: string;
    nis?: string;
    nisn?: string;
    gender: 'male' | 'female';
    birth_date?: string;
    birth_place?: string;
    address?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_email?: string;
    class_name?: string;
    academic_year: number;
}

export interface StudentFormData
    extends Omit<Student, 'id' | 'created_at' | 'updated_at'> {}

export interface StudentFilters {
    search?: string;
    class_id?: number;
    academic_year?: number;
    status?: string;
    gender?: string;
    performance_status?: string;
}

export interface StudentStats {
    total_students: number;
    active_students: number;
    by_class: Array<{
        class_name: string;
        count: number;
    }>;
    by_gender: {
        male: number;
        female: number;
    };
    by_performance: {
        excellent: number;
        good: number;
        satisfactory: number;
        needs_attention: number;
    };
}
