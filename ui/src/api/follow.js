export function getFollow(userID, threadID) {
  let url = new URL("http://" + process.env.API_URL + "/api/follow");
  let params = { userID, threadID };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
  });
}

export function follow(token, userID, threadID) {
  userID = parseInt(userID);
  threadID = parseInt(threadID);
  return fetch("http://" + process.env.API_URL + "/api/follow", {
    method: "POST",
    body: JSON.stringify({ userID, threadID }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}

export function unfollow(token, userID, threadID) {
  userID = parseInt(userID);
  threadID = parseInt(threadID);
  return fetch("http://" + process.env.API_URL + "/api/follow", {
    method: "DELETE",
    body: JSON.stringify({ userID, threadID }),
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}
