function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict`;
}
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        const [key, val] = c.trim().split('=');
        if (key === name) return val;
    }
    return null;
}
const cookieBanner = document.getElementById("cookieBanner");
const config_cookie = getCookie("cfck");
if (!config_cookie){
    cookieBanner.classList.remove("hide");
}
const cookieConfig = async() =>{
    if (config_cookie){
        setCookie("cfck", "accepted", 365)
    }else{
        setCookie("cfck", "accepted", 0.2)
    }
    cookieBanner.classList.add("hide")
}