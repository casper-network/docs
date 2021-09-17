const analyticsTrackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID || "UA-173562145-3";
const tagTrackingId = process.env.GOOGLE_TAG_TRACKING_ID || "UA-173562145-2";
const anonymizeIP = process.env.GOOGLE_ANALYTICS_ANONYMIZE_IP || true;

module.exports = {
    googleAnalytics: {
        trackingID: analyticsTrackingId,
        anonymizeIP: anonymizeIP,
    },
    gtag: {
        trackingID: tagTrackingId,
    },
};
