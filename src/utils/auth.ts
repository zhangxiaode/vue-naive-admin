import Cookies from "js-cookie";
const TokenKey = "vue_token";
export function getToken(): string | undefined {
  return Cookies.get("vue_token");
}
export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}
export function removeToken(): void {
  Cookies.remove(TokenKey);
}
