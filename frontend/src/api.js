export function getToken() {
  return localStorage.getItem('token') || '';
}

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
