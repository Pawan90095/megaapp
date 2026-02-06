export interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    category?: string;
    proficiency: number;
}

export interface UserProfile {
    id: string;
    slug: string;
    email: string;
    full_name: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
    website?: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
}
