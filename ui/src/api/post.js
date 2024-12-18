export function getPosts(threadID, page, pageSize) {
  let url = new URL("http://" + process.env.API_URL + "/api/post");
  let params = { threadID, page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function getPostsByUserID(userID, page, pageSize) {
  let url = new URL("http://" + process.env.API_URL + "/api/post");
  let params = { userID, page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function createPost(token, threadID, content) {
  return fetch("http://" + process.env.API_URL + "/api/post", {
    method: "POST",
    body: JSON.stringify({ threadID, content }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}

export function editPost(token, postID, content) {
  return fetch("http://" + process.env.API_URL + "/api/post/" + postID, {
    method: "PATCH",
    body: JSON.stringify({ content }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}
