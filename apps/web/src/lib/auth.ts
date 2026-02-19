const COOKIE_NAME = "gym-session";
const COOKIE_VALUE = "authenticated";

export function login(username: string, password: string): boolean {
  if (username === "admin" && password === "admin") {
    document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    return true;
  }
  return false;
}

export function logout(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export { COOKIE_NAME, COOKIE_VALUE };
