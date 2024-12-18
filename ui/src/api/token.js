export function createToken(username, password) {
  return fetch("http://" + process.env.API_URL + "/api/token", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
