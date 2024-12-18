export function getUser(id) {
  return fetch(process.env.API_URL + "/user/" + id, {
    method: "GET",
  });
}
