const tagTrackingId = process.env.GOOGLE_TAG_TRACKING_ID;
const anonymizeIP = process.env.GOOGLE_TAG_ANONYMIZE_IP || true;

module.exports = {
    trackingID: tagTrackingId,
    anonymizeIP: anonymizeIP,
};
