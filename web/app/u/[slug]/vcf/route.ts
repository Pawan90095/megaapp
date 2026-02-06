import { NextRequest, NextResponse } from 'next/server';

interface UserProfile {
    full_name: string;
    headline?: string;
    email: string;
    website?: string;
    location?: string;
    bio?: string;
    is_public: boolean;
}

// Reuse the fetch logic or just fetch again. For Route Handlers, simpler to fetch.
async function getProfile(slug: string): Promise<UserProfile | null> {
    try {
        const res = await fetch(`http://localhost:3000/api/users/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        // Error fetching profile for VCF - return null
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const profile = await getProfile(slug);

    if (!profile || !profile.is_public) {
        return new NextResponse('Not Found', { status: 404 });
    }

    // Construct vCard 3.0
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:;${profile.full_name};;;`,
        `FN:${profile.full_name}`,
        profile.headline ? `TITLE:${profile.headline}` : '',
        `EMAIL;type=INTERNET;type=WORK:${profile.email}`,
        profile.website ? `URL:${profile.website}` : '',
        profile.location ? `ADR;type=WORK:;;${profile.location};;;;` : '', // Simplified address mapping
        profile.bio ? `NOTE:${profile.bio.replace(/\n/g, '\\n')}` : '',
        'END:VCARD'
    ].filter(line => line !== '').join('\n');

    return new NextResponse(vcard, {
        headers: {
            'Content-Type': 'text/vcard',
            'Content-Disposition': `attachment; filename="${profile.full_name.replace(/[^a-z0-9]/gi, '_')}.vcf"`,
        },
    });
}
