const analyticsTrackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID;
const tagTrackingId = process.env.GOOGLE_TAG_TRACKING_ID;
const anonymizeIP = process.env.GOOGLE_ANALYTICS_ANONYMIZE_IP || true;

module.exports = {
    googleAnalytics: {
        trackingID: analyticsTrackingId,
    },
    gtag: {
        trackingID: tagTrackingId,
        anonymizeIP: anonymizeIP,
    },
};
