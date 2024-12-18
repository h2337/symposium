export function getPosts(threadID, page, pageSize) {
  let url = new URL(process.env.API_URL + "/post");
  let params = { threadID, page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}
