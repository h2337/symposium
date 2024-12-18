export function getPosts(threadID, page, pageSize) {
  let url = new URL(process.env.API_URL + "/post");
  let params = { threadID, page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function getPostsByUserID(userID, page, pageSize) {
  let url = new URL(process.env.API_URL + "/post");
  let params = { userID, page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function createPost(token, threadID, content) {
  return fetch(process.env.API_URL + "/post", {
    method: "POST",
    body: JSON.stringify({ token, threadID, content }),
  });
}
