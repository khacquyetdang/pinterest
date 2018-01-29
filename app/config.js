console.log("process.env.API_BASE_URL: ", process.env.API_BASE_URL);
console.log("process.env: ", process.env);

export const FACEBOOK_ID = process.env.FACEBOOK_ID;
export const apiBaseUrl = process.env.API_BASE_URL;
export const registerUrl = apiBaseUrl + "signup";
export const loginUrl = apiBaseUrl + "login";
export const authWithFaceBookUrl = apiBaseUrl + "auth/facebook";
export const authWithFaceBookTokenUrl = apiBaseUrl + "auth/facebook/token";

export const authWithTwitterTokenUrl = apiBaseUrl + "auth/twitter/token";
export const getTwitterTokenUrl = apiBaseUrl + "auth/twitter/reverse";

export const logoutUrl = apiBaseUrl + "logout";
export const photoUrl = apiBaseUrl + "photo";
export const myphotoUrl = apiBaseUrl + "myphoto";
export const voteUrl = apiBaseUrl + "photo/vote/";
