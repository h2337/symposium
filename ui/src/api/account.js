export function createAccount(username, email, password) {
  return fetch(process.env.API_URL + "/account", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
