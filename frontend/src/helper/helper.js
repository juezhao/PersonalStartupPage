
//Helper function to get the value of a cookie
function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for(let i = 0; i <cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
    return cookie.substring(name.length);
    }
  }
  return undefined;
}
//delete the cookie
function deleteCookie(cname) {
  const d = new Date();
  d.setDate(0);
  document.cookie = `${cname}= ; expires=${d.toUTCString ()}; path=/`; 
}




export { getCookie,deleteCookie };