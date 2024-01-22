import dayjs from "dayjs";

export const saveSession = (session: any) => {
  localStorage.setItem('session', JSON.stringify(session));
}

export const clearSession = () => {
  localStorage.removeItem('session');
}

export const getSession = () => {
  const session = localStorage.getItem('session');
  const parsedSession = session ? JSON.parse(session) : null;

  if (parsedSession && dayjs().isBefore(dayjs(parsedSession.expires))) {
    return parsedSession;
  }

  clearSession();
  return null;
}

export const getCookie = (cookieString: string, cname: string) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(cookieString);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
