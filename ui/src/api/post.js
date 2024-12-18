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
    body: JSON.stringify({ token, threadID, content }),
  });
}

export function editPost(token, postID, content) {
  return fetch("http://" + process.env.API_URL + "/api/post/" + postID, {
    method: "PATCH",
    body: JSON.stringify({ token, content }),
  });
}
