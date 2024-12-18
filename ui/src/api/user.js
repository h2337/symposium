export function getUser(id) {
  return fetch("http://" + process.env.API_URL + "/user/" + id, {
    method: "GET",
  });
}

export function createUser(username, email, password) {
  return fetch("http://" + process.env.API_URL + "/user", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
