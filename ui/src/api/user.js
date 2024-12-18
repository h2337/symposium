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

export function uploadAvatar(token, avatar) {
  let formData = new FormData();
  formData.append("token", token);
  formData.append("avatar", avatar);
  return fetch("http://" + process.env.API_URL + "/user/avatar", {
    method: "POST",
    body: formData,
  });
}
