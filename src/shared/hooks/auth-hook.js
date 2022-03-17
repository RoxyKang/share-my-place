import { useState, useCallback, useEffect } from "react";
let logoutTimer; // not a state of the component

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState();
  const [tokenExpiration, setTokenExpiration] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpiration(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      // when reaches timeout, call logout (hanlder function)
      // logout will clear everything, and that changes this useEffect()'s dependencies
      // and then we clear logoutTimer
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiration]);

  // note that useEffect will run only after the first render is done
  // so we could potentially add a check in the JSX to render something else while checking storedData
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]); // only runs once when the app mounts, login won't change b/c useCallback

  return { token, login, logout, userId };
};
