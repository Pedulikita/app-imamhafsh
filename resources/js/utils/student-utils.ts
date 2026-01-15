import { Student, StudentImportData } from '@/types/student';

// Student data validation
export const validateStudentData = (
    data: Partial<Student>,
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
        errors.push('Name is required');
    }

    if (!data.student_id?.trim()) {
        errors.push('Student ID is required');
    }

    if (!data.gender) {
        errors.push('Gender is required');
    }

    if (!data.birth_date) {
        errors.push('Birth date is required');
    }

    if (!data.birth_place?.trim()) {
        errors.push('Birth place is required');
    }

    if (!data.address?.trim()) {
        errors.push('Address is required');
    }

    if (!data.parent_name?.trim()) {
        errors.push('Parent name is required');
    }

    if (!data.parent_phone?.trim()) {
        errors.push('Parent phone is required');
    }

    if (!data.academic_year) {
        errors.push('Academic year is required');
    }

    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Invalid phone format');
    }

    if (data.parent_phone && !isValidPhone(data.parent_phone)) {
        errors.push('Invalid parent phone format');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation (Indonesian format)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.startsWith('0')) {
        return '+62' + cleaned.slice(1);
    }
    if (cleaned.startsWith('62')) {
        return '+' + cleaned;
    }
    return '+62' + cleaned;
};

// Generate student ID
export const generateStudentId = (
    academicYear: number,
    sequence: number,
): string => {
    const year = academicYear.toString().slice(-2);
    const seq = sequence.toString().padStart(4, '0');
    return `${year}${seq}`;
};

// Format student status
export const formatStudentStatus = (
    status: string,
): { text: string; className: string } => {
    switch (status) {
        case 'active':
            return { text: 'Active', className: 'bg-green-100 text-green-800' };
        case 'inactive':
            return { text: 'Inactive', className: 'bg-gray-100 text-gray-800' };
        case 'graduated':
            return {
                text: 'Graduated',
                className: 'bg-blue-100 text-blue-800',
            };
        case 'transferred':
            return {
                text: 'Transferred',
                className: 'bg-yellow-100 text-yellow-800',
            };
        default:
            return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
};

// Format performance status
export const formatPerformanceStatus = (
    status: string,
): { text: string; className: string } => {
    switch (status) {
        case 'excellent':
            return {
                text: 'Excellent',
                className: 'bg-green-100 text-green-800',
            };
        case 'good':
            return { text: 'Good', className: 'bg-blue-100 text-blue-800' };
        case 'satisfactory':
            return {
                text: 'Satisfactory',
                className: 'bg-yellow-100 text-yellow-800',
            };
        case 'needs_attention':
            return {
                text: 'Needs Attention',
                className: 'bg-red-100 text-red-800',
            };
        default:
            return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
};

// Calculate age from birth date
export const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age;
};

// Parse CSV data for import
export const parseStudentCSV = (csvText: string): StudentImportData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

    return lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const student: any = {};

        headers.forEach((header, index) => {
            const key = mapCsvHeaderToField(header);
            if (key) {
                student[key] = values[index] || '';
            }
        });

        return student as StudentImportData;
    });
};

// Map CSV headers to student fields
const mapCsvHeaderToField = (header: string): string | null => {
    const mapping: { [key: string]: string } = {
        name: 'name',
        nama: 'name',
        email: 'email',
        phone: 'phone',
        telepon: 'phone',
        student_id: 'student_id',
        id_siswa: 'student_id',
        nis: 'nis',
        nisn: 'nisn',
        gender: 'gender',
        jenis_kelamin: 'gender',
        birth_date: 'birth_date',
        tanggal_lahir: 'birth_date',
        birth_place: 'birth_place',
        tempat_lahir: 'birth_place',
        address: 'address',
        alamat: 'address',
        parent_name: 'parent_name',
        nama_orang_tua: 'parent_name',
        parent_phone: 'parent_phone',
        telepon_orang_tua: 'parent_phone',
        class: 'class_name',
        kelas: 'class_name',
        academic_year: 'academic_year',
        tahun_akademik: 'academic_year',
    };

    return mapping[header.toLowerCase()] || null;
};

// Export students to CSV
export const exportStudentsToCSV = (students: Student[]): string => {
    const headers = [
        'Name',
        'Student ID',
        'Email',
        'Phone',
        'Gender',
        'Birth Date',
        'Birth Place',
        'Address',
        'Parent Name',
        'Parent Phone',
        'Class',
        'Academic Year',
        'Status',
    ];

    const csvContent = [headers.join(',')];

    students.forEach((student) => {
        const row = [
            `"${student.name}"`,
            `"${student.student_id}"`,
            `"${student.email || ''}"`,
            `"${student.phone || ''}"`,
            `"${student.gender}"`,
            `"${student.birth_date || ''}"`,
            `"${student.birth_place || ''}"`,
            `"${student.address || ''}"`,
            `"${student.parent_name || ''}"`,
            `"${student.parent_phone || ''}"`,
            `"${student.class?.name || ''}"`,
            `"${student.academic_year}"`,
            `"${student.status}"`,
        ];
        csvContent.push(row.join(','));
    });

    return csvContent.join('\n');
};

// Download CSV file
export const downloadCSV = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Filter students based on criteria
export const filterStudents = (
    students: Student[],
    filters: Partial<Student & { search: string }>,
): Student[] => {
    return students.filter((student) => {
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                student.name.toLowerCase().includes(searchLower) ||
                student.student_id.toLowerCase().includes(searchLower) ||
                (student.email &&
                    student.email.toLowerCase().includes(searchLower)) ||
                (student.class?.name &&
                    student.class.name.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;
        }

        // Class filter
        if (filters.class_id && student.class_id !== filters.class_id) {
            return false;
        }

        // Academic year filter
        if (
            filters.academic_year &&
            student.academic_year !== filters.academic_year
        ) {
            return false;
        }

        // Status filter
        if (filters.status && student.status !== filters.status) {
            return false;
        }

        // Gender filter
        if (filters.gender && student.gender !== filters.gender) {
            return false;
        }

        return true;
    });
};
