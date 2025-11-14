export interface Application {
    uuid: any;
    data: {
        id: number;
        job_id: string;
        user_id: string;
        name: string;
        email: string;
        phone: string;
        resume: string;
        cover_letter: string;
        linkedin: string;
        portfolio_url: string;
        message: string;
        status: string;
        interview_date: string; // ISO 8601 date string
        interview_location: string;
        hr_notes: string;
        rating: string;
        assigned_to: string;
    }
}

export interface ApplicationDropdown {
    id: number;
    title: string;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}
