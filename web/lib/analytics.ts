type AnalyticsEvent = 'profile_viewed' | 'vcf_downloaded' | 'qr_code_shared';

class Analytics {
    private static instance: Analytics;

    private constructor() { }

    public static getInstance(): Analytics {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }

    public capture(event: AnalyticsEvent, properties?: Record<string, any>) {
        const payload = {
            type: event, // 'profile_viewed' | 'vcf_downloaded' | 'qr_code_shared'
            slug: properties?.slug,
            meta: properties
        };

        // Fire and forget - don't await
        fetch('http://localhost:3000/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error('[Analytics] Failed to send event:', err));

        if (properties?.slug) {
            console.log(`[Analytics] Sent ${event} for ${properties.slug}`);
        }
    }
}

export const analytics = Analytics.getInstance();
