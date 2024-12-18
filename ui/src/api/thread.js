export function getThreads(categoryID, page, pageSize) {
  let url = new URL("http://" + process.env.API_URL + "/thread");
  let params;
  if (categoryID !== undefined) params = { categoryID, page, pageSize };
  else params = { page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function getThread(id) {
  return fetch("http://" + process.env.API_URL + "/thread/" + id, {
    method: "GET",
  });
}

export function createThread(token, title, content, categoryId) {
  return fetch("http://" + process.env.API_URL + "/thread", {
    method: "POST",
    body: JSON.stringify({ token, title, content, categoryId }),
  });
}
