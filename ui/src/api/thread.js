export function loadThreads(categoryID, page, pageSize) {
  let url = new URL(process.env.API_URL + "/thread");
  let params;
  if (categoryID !== undefined) params = { categoryID, page, pageSize };
  else params = { page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function loadThread(id) {
  return fetch(process.env.API_URL + "/thread/" + id, {
    method: "GET",
  });
}

export function createThread(token, title, content, categoryId) {
  return fetch(process.env.API_URL + "/thread", {
    method: "POST",
    body: JSON.stringify({ token, title, content, categoryId }),
  });
}
