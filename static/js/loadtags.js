const cookieString = document.cookie;
let cookies;

const cookiePrefs = cookieString.split(";").find((cookie) => cookie.trim().startsWith("cookie-prefs="));
if (cookiePrefs) {
    cookies = JSON.parse(decodeURIComponent(cookiePrefs.split("=")[1]));
}

if (!window.gtmConfigured && cookies) {
    const layer = "dataLayer";
    window[layer] = window[layer] || [];
    /**
     * Iterate through the items and check (based on the selections)
     * which ones have been selected by the user and add them as
     * events to the Google Tag Manager DataLayer
     */
    cookies.forEach((item) => {
        const { name, value } = item;
        const state = value ? "active" : "inactive";
        const obj = { event: name };
        obj[name] = state;
        window[layer].push(obj);
    });

    window.gtmConfigured = true;
}
