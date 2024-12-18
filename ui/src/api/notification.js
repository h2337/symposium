export function getNotifications(token, page, pageSize) {
  let url = new URL("http://" + process.env.API_URL + "/api/notification");
  let params;
  params = { page, pageSize };
  url.search = new URLSearchParams(params).toString();
  return fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}

export function getUnseenNotificationCount(token) {
  let url = new URL(
    "http://" + process.env.API_URL + "/api/notification/unseenCount"
  );
  return fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
}

export function markNotificationsSeen(token, ids) {
  return fetch("http://" + process.env.API_URL + "/api/notification", {
    method: "POST",
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
    body: JSON.stringify({ ids }),
  });
}
