export function createToken(username, password) {
  return fetch(process.env.API_URL + "/token", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
