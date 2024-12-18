export function getSettings() {
  return fetch("http://" + process.env.API_URL + "/setting", {
    method: "GET",
  });
}
