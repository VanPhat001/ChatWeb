import axios from "axios"

function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function axiosConfig() {
    const accessToken = getCookie('access_token')
    const AuthorizationString = accessToken ? `Bearer ${accessToken}` : null

    return axios.create({
        baseURL: 'http://localhost:4193/api',
        headers: {
            "Content-Type": 'application/json',
            Authorization: AuthorizationString
        }
    })
}

export default axiosConfig