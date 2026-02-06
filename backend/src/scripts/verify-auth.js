const API_URL = 'http://localhost:3000/api/users';
const TEST_USER = {
    slug: 'secureuser_' + Date.now(),
    email: 'secure_' + Date.now() + '@test.com',
    full_name: 'Secure User',
    password: 'SecurePassword123!'
};

async function testAuth() {
    try {
        console.log('1. Registering User...');
        const regRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(regData.message || 'Registration failed');
        console.log('✅ Registered:', regData.slug);

        console.log('2. Logging In...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');

        const token = loginData.token;
        console.log('✅ Logged In. Token received.');

        console.log('3. Updating Profile (Protected)...');
        const updateRes = await fetch(`${API_URL}/${TEST_USER.slug}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ headline: 'Security Expert' })
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(updateData.message || 'Update failed');
        console.log('✅ Updated Profile:', updateData.headline);

        console.log('4. Testing Access Denied...');
        const failRes = await fetch(`${API_URL}/${TEST_USER.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ headline: 'Hacker' })
        });

        if (failRes.status === 401) {
            console.log('✅ Access Denied (401) as expected.');
        } else {
            console.error('❌ Unexpected status:', failRes.status);
        }

    } catch (e) {
        console.error('❌ Test Failed:', e.message);
    }
}

testAuth();
