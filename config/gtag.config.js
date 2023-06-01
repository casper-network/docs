const trackingID = process.env.GOOGLE_TAG_TRACKING_ID;
const anonymizeIP = process.env.GOOGLE_TAG_ANONYMIZE_IP !== "false";

module.exports = {
    trackingID: trackingID,
    anonymizeIP: anonymizeIP,
};
