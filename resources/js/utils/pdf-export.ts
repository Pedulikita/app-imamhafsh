interface Student {
    id: number;
    name: string;
    student_id: string;
    class: string;
    academic_year: number;
    average_grade: number;
    attendance_rate: number;
    total_grades: number;
    status: 'excellent' | 'good' | 'satisfactory' | 'needs_attention';
}

interface Stats {
    total_students: number;
    excellent_performance: number;
    needs_attention: number;
    overall_average_grade: number;
    overall_attendance_rate: number;
}

const formatStatusText = (status: string): string => {
    switch (status) {
        case 'needs_attention':
            return 'Needs Attention';
        case 'excellent':
            return 'Excellent';
        case 'good':
            return 'Good';
        case 'satisfactory':
            return 'Satisfactory';
        default:
            return status;
    }
};

const getStatusClass = (status: string): string => {
    switch (status) {
        case 'needs_attention':
            return 'status-attention';
        case 'excellent':
            return 'status-excellent';
        case 'good':
            return 'status-good';
        case 'satisfactory':
            return 'status-satisfactory';
        default:
            return 'status-satisfactory';
    }
};

const generatePrintStyles = (): string => {
    return `
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #ddd;
                padding-bottom: 20px;
            }
            .header h1 {
                margin: 0 0 10px 0;
                color: #2563eb;
                font-size: 28px;
            }
            .header h2 {
                margin: 0 0 15px 0;
                color: #666;
                font-weight: normal;
                font-size: 18px;
            }
            .header p {
                margin: 0;
                color: #888;
                font-size: 14px;
            }
            .stats { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 20px; 
                margin-bottom: 30px; 
            }
            .stat-card { 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .stat-card h3 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .table th, .table td { 
                border: 1px solid #ddd; 
                padding: 12px 8px; 
                text-align: left; 
                font-size: 12px;
            }
            .table th { 
                background-color: #f8f9fa; 
                font-weight: bold;
                color: #495057;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .table tbody tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .table tbody tr:hover {
                background-color: #e3f2fd;
            }
            .status-excellent { 
                color: #16a34a; 
                font-weight: bold; 
                background-color: #dcfce7;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
            }
            .status-good { 
                color: #2563eb; 
                font-weight: bold; 
                background-color: #dbeafe;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
            }
            .status-satisfactory { 
                color: #ca8a04; 
                font-weight: bold; 
                background-color: #fef3c7;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
            }
            .status-attention { 
                color: #dc2626; 
                font-weight: bold; 
                background-color: #fee2e2;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            @media print { 
                body { margin: 0; }
                .stats { grid-template-columns: repeat(2, 1fr); }
                .table { font-size: 10px; }
                .table th, .table td { padding: 8px 4px; }
            }
        </style>
    `;
};

const generateReportHeader = (): string => {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return `
        <div class="header">
            <h1>Student Progress Reports</h1>
            <h2>BQ Islamic Boarding School</h2>
            <p>Generated on: ${currentDate}</p>
        </div>
    `;
};

const generateStatsSection = (stats: Stats): string => {
    return `
        <div class="stats">
            <div class="stat-card">
                <h3>Total Students</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 0; color: #2563eb;">
                    ${stats.total_students}
                </p>
            </div>
            <div class="stat-card">
                <h3>Excellent Performance</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 0; color: #16a34a;">
                    ${stats.excellent_performance}
                </p>
            </div>
            <div class="stat-card">
                <h3>Needs Attention</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 0; color: #dc2626;">
                    ${stats.needs_attention}
                </p>
            </div>
            <div class="stat-card">
                <h3>Avg Attendance</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 0; color: #7c3aed;">
                    ${stats.overall_attendance_rate}%
                </p>
            </div>
        </div>
    `;
};

const generateStudentTable = (students: Student[]): string => {
    const tableRows = students
        .map(
            (student) => `
        <tr>
            <td style="font-weight: 600;">${student.name}</td>
            <td>${student.student_id}</td>
            <td>${student.class}</td>
            <td>${student.academic_year}</td>
            <td style="text-align: center; font-weight: 600;">${student.average_grade}</td>
            <td style="text-align: center; font-weight: 600;">${student.attendance_rate}%</td>
            <td>
                <span class="${getStatusClass(student.status)}">
                    ${formatStatusText(student.status)}
                </span>
            </td>
        </tr>
    `,
        )
        .join('');

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Class</th>
                    <th>Academic Year</th>
                    <th style="text-align: center;">Average Grade</th>
                    <th style="text-align: center;">Attendance Rate</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
};

const generateReportFooter = (): string => {
    return `
        <div class="footer">
            <p>This report was automatically generated by the BQ Islamic Boarding School Management System</p>
            <p>© ${new Date().getFullYear()} BQ Islamic Boarding School. All rights reserved.</p>
        </div>
    `;
};

export const exportProgressReportToPDF = (
    students: Student[],
    stats: Stats,
): void => {
    const printContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Student Progress Reports - BQ Islamic Boarding School</title>
            ${generatePrintStyles()}
        </head>
        <body>
            ${generateReportHeader()}
            ${generateStatsSection(stats)}
            ${generateStudentTable(students)}
            ${generateReportFooter()}
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        // Add small delay to ensure content is loaded before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    } else {
        // Fallback if popup is blocked
        console.error(
            'Unable to open print window. Please allow popups for this site.',
        );
        alert(
            'Unable to open print window. Please allow popups for this site and try again.',
        );
    }
};
