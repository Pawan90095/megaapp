import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const user = await pool.query('SELECT id, slug, email, full_name, headline, bio, avatar_url, location, website, is_public, privacy_settings FROM users WHERE slug = $1', [slug]);

        if (user.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userData = user.rows[0];

        if (!userData.is_public) {
            res.status(404).json({ message: 'User not found' }); // Return 404 to hide private profiles
            return;
        }

        // Apply Privacy Rules
        const privacy = userData.privacy_settings || {};
        const publicData = { ...userData };

        if (!privacy.show_email) {
            delete publicData.email;
        }
        if (!privacy.show_location) {
            delete publicData.location;
        }
        // if (!privacy.show_phone) ... we don't have phone yet, but if we did.

        const userId = userData.id;

        // Fetch related data in parallel
        const [experience, education, skills, social_links] = await Promise.all([
            pool.query('SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC', [userId]),
            pool.query('SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC', [userId]),
            pool.query('SELECT * FROM skills WHERE user_id = $1 ORDER BY proficiency DESC', [userId]),
            pool.query('SELECT * FROM social_links WHERE user_id = $1', [userId])
        ]);

        res.json({
            ...publicData,
            experience: experience.rows,
            education: education.rows,
            skills: skills.rows,
            social_links: social_links.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const {
        full_name, headline, bio, location, website, is_public, privacy_settings,
        experience, education, skills
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Update User Basic Info
        const userResult = await client.query(
            `UPDATE users 
             SET full_name = COALESCE($1, full_name),
                 headline = COALESCE($2, headline),
                 bio = COALESCE($3, bio),
                 location = COALESCE($4, location),
                 website = COALESCE($5, website),
                 is_public = COALESCE($6, is_public),
                 privacy_settings = COALESCE($7, privacy_settings),
                 updated_at = NOW()
             WHERE slug = $8
             RETURNING id, slug, email, full_name, headline, bio, avatar_url, location, website, is_public, privacy_settings`,
            [full_name, headline, bio, location, website, is_public, privacy_settings, slug]
        );

        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const user = userResult.rows[0];
        const userId = user.id;

        // 2. Handle Experience (Replace All)
        if (Array.isArray(experience)) {
            await client.query('DELETE FROM experience WHERE user_id = $1', [userId]);
            for (const exp of experience) {
                await client.query(
                    `INSERT INTO experience (user_id, title, company, location, start_date, end_date, is_current, description)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [userId, exp.title, exp.company, exp.location, exp.start_date, exp.end_date, exp.is_current, exp.description]
                );
            }
        }

        // 3. Handle Education (Replace All)
        if (Array.isArray(education)) {
            await client.query('DELETE FROM education WHERE user_id = $1', [userId]);
            for (const edu of education) {
                await client.query(
                    `INSERT INTO education (user_id, school, degree, field_of_study, start_date, end_date, description)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [userId, edu.school, edu.degree, edu.field_of_study, edu.start_date, edu.end_date, edu.description]
                );
            }
        }

        // 4. Handle Skills (Replace All)
        if (Array.isArray(skills)) {
            await client.query('DELETE FROM skills WHERE user_id = $1', [userId]);
            for (const skill of skills) {
                await client.query(
                    `INSERT INTO skills (user_id, name, category, proficiency)
                     VALUES ($1, $2, $3, $4)`,
                    [userId, skill.name, skill.category, skill.proficiency]
                );
            }
        }

        await client.query('COMMIT');

        // 5. Return updated full profile
        // Efficient way: reuse the getProfile logic or just fetch all again. 
        // For correctness/simplicity, let's fetch strictly what we just committed.

        // Parallel fetch for sub-resources
        const [expRes, eduRes, skillRes] = await Promise.all([
            client.query('SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC', [userId]),
            client.query('SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC', [userId]),
            client.query('SELECT * FROM skills WHERE user_id = $1 ORDER BY proficiency DESC', [userId])
        ]);

        res.json({
            ...user,
            experience: expRes.rows,
            education: eduRes.rows,
            skills: skillRes.rows,
            social_links: [] // Placeholder until we add social links support
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

export const createProfile = async (req: Request, res: Response) => {
    const { slug, email, full_name, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'default123', salt); // Fail-safe? Or reject? Better default empty or error if missing.
        // Assuming password is required.

        const newUser = await pool.query(
            'INSERT INTO users (slug, email, full_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [slug, email, full_name, hashedPassword]
        );

        const user = newUser.rows[0];
        const token = jwt.sign({ id: user.id, slug: user.slug }, JWT_SECRET, { expiresIn: '7d' }); // Longer expiry for mobile

        res.status(201).json({ ...user, token });
    } catch (err: any) {
        if (err.code === '23505') { // Unique violation
            res.status(409).json({ message: 'User already exists' });
            return;
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.rows[0].id, slug: user.rows[0].slug }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, slug: user.rows[0].slug });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
