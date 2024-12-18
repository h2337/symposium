export function getCategories() {
  return fetch("http://" + process.env.API_URL + "/api/category", {
    method: "GET",
  });
}

export function createCategory(token, name, color) {
  return fetch("http://" + process.env.API_URL + "/api/category", {
    method: "POST",
    body: JSON.stringify({ name, color }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}

export function deleteCategory(token, id) {
  return fetch("http://" + process.env.API_URL + "/api/category", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}
