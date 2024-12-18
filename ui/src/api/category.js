export function getCategories() {
  return fetch("http://" + process.env.API_URL + "/category", {
    method: "GET",
  });
}

export function createCategory(token, name, color) {
  return fetch("http://" + process.env.API_URL + "/category", {
    method: "POST",
    body: JSON.stringify({ token, name, color }),
  });
}

export function deleteCategory(token, id) {
  return fetch("http://" + process.env.API_URL + "/category", {
    method: "DELETE",
    body: JSON.stringify({ token, id }),
  });
}
