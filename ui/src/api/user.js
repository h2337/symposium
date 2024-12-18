export function getUser(id) {
  return fetch(process.env.API_URL + "/user/" + id, {
    method: "GET",
  });
}

export function createUser(username, email, password) {
  return fetch(process.env.API_URL + "/account", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
