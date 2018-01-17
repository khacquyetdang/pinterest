
export function getToken(state) {
    console.log("Gettoken");
    return state.get('app').get('access_token');
}    