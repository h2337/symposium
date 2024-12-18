export function loadThreads(categoryId, page, pageSize) {
  let url = new URL(process.env.API_URL + "/thread");
  let params;
  if (categoryId !== undefined) params = { categoryId, page, pageSize };
  else params = { page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function createThread(token, title, content, categoryId) {
  return fetch(process.env.API_URL + "/thread", {
    method: "POST",
    body: JSON.stringify({ token, title, content, categoryId }),
  });
}
