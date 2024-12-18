export function getThreads(categoryID, page, pageSize) {
  let url = new URL("http://" + process.env.API_URL + "/api/thread");
  let params;
  if (categoryID !== undefined) params = { categoryID, page, pageSize };
  else params = { page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function getThread(id) {
  return fetch("http://" + process.env.API_URL + "/api/thread/" + id, {
    method: "GET",
  });
}

export function createThread(token, title, content, categoryId) {
  return fetch("http://" + process.env.API_URL + "/api/thread", {
    method: "POST",
    body: JSON.stringify({ title, content, categoryId }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}
