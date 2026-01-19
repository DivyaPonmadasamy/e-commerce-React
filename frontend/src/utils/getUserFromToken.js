import jwtDecode from "jwt-decode";

export function getUserFromToken() {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find(row => row.startsWith("token="));
  if (!tokenCookie) return null;

  const token = tokenCookie.split("=")[1];
  const decoded = jwtDecode(token);

  return {
    email: decoded.sub,
  };
}