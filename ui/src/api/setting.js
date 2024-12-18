export function getSettings() {
  return fetch("http://" + process.env.API_URL + "/api/setting", {
    method: "GET",
  });
}

// TODO: No token?
export function updateSettings(settings) {
  return fetch("http://" + process.env.API_URL + "/api/setting", {
    method: "POST",
    body: JSON.stringify(settings),
  });
}
