
export function getToken(state) {
    console.log("Gettoken");
    try {
        return state.get('app').get('access_token');
    } catch (e) {
        console.log("Gettoken exception: ");
        return null;
    }
}

export function getLocale(state) {
    console.log("getLocale");
    try {
        return state.get('language').get('locale') || state.get('locale');
    } catch (e) {
        console.log("getLocale exception: ");
        return null;
    }
}