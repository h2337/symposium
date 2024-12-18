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
