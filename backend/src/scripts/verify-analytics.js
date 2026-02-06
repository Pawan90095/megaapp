const API_URL = 'http://localhost:3000/api';

async function testAnalytics() {
    try {
        const timestamp = Date.now();
        const slug = 'analytics_user_' + timestamp;

        console.log('1. Creating User (to get token)...');
        const userRes = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: slug,
                email: `analytics_${timestamp}@test.com`,
                full_name: 'Analytics Tester',
                password: 'password123'
            })
        });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.message);

        const token = userData.token;
        console.log(`✅ User Created. Token Recieved: ${token ? 'Yes' : 'NO'}`);

        console.log('2. Tracking Events...');
        // Simulate 3 views, 1 download
        await fetch(`${API_URL}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, type: 'profile_viewed' })
        });
        await fetch(`${API_URL}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, type: 'profile_viewed' })
        });
        await fetch(`${API_URL}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, type: 'profile_viewed' })
        });
        await fetch(`${API_URL}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, type: 'vcf_downloaded' })
        });
        console.log('✅ Events Tracked.');

        console.log('3. Fetching Stats (Protected)...');
        const statsRes = await fetch(`${API_URL}/analytics/${slug}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const stats = await statsRes.json();

        if (!statsRes.ok) throw new Error(stats.message);

        console.log('✅ Stats Received:', stats);

        if (stats['profile_viewed'] === 3 && stats['vcf_downloaded'] === 1) {
            console.log('🎉 VERIFICATION SUCCESS: counts match!');
        } else {
            console.error('❌ COUNTS MISMATCH');
        }

    } catch (e) {
        console.error('❌ Test Failed:', e.message);
    }
}

testAnalytics();
