import { notFound } from 'next/navigation';
import { UserProfile } from '../../types';
import ProfileActions from './ProfileActions';

async function getProfile(slug: string): Promise<UserProfile | null> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://megaapp-walk.vercel.app';
    try {
        const res = await fetch(`${API_URL}/api/users/${slug}`, {
            cache: 'no-store', // Always fetch fresh data
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch data');
        }

        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const profile = await getProfile(slug);

    if (!profile) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white shadow rounded-lg p-6 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-center">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} className="h-32 w-32 rounded-full object-cover mb-4 sm:mb-0 sm:mr-8" />
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center mb-4 sm:mb-0 sm:mr-8">
                                <span className="text-4xl font-bold text-indigo-600">{profile.full_name.charAt(0)}</span>
                            </div>
                        )}
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-extrabold text-gray-900">{profile.full_name}</h1>
                            {profile.headline && <p className="text-xl text-gray-600 mt-1">{profile.headline}</p>}
                            {profile.location && (
                                <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-500">
                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            <ProfileActions slug={profile.slug} />
                        </div>
                    </div>
                    {profile.bio && (
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900">About</h3>
                            <p className="mt-2 text-gray-600 leading-relaxed">{profile.bio}</p>
                        </div>
                    )}
                </div>

                {/* Experience Section */}
                {profile.experience.length > 0 && (
                    <div className="bg-white shadow rounded-lg p-6 sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                        <div className="space-y-8">
                            {profile.experience.map((exp) => (
                                <div key={exp.id} className="relative pl-8 border-l-2 border-indigo-200">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-500"></div>
                                    <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                                    <div className="text-indigo-600 font-medium">{exp.company}</div>
                                    <div className="text-sm text-gray-500 mb-2">
                                        {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).getFullYear() : '')}
                                    </div>
                                    {exp.description && <p className="text-gray-600">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education Section */}
                {profile.education.length > 0 && (
                    <div className="bg-white shadow rounded-lg p-6 sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                        <div className="space-y-8">
                            {profile.education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="text-xl font-semibold text-gray-900">{edu.school}</h3>
                                    <div className="text-indigo-600 font-medium">{edu.degree} {edu.field_of_study && ` in ${edu.field_of_study}`}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {profile.skills.length > 0 && (
                    <div className="bg-white shadow rounded-lg p-6 sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                                <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
