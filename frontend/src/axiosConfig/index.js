import axios from "axios"
import VueCookies from 'vue-cookies'

function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

const accessToken = getCookie('access_token')
// console.log({ accessToken })
const AuthorizationString = accessToken ? `Bearer ${accessToken}` : null

export default axios.create({
    baseURL: 'http://localhost:4193/api',
    headers: {
        "Content-Type": 'application/json',
        Authorization: AuthorizationString
    }
})