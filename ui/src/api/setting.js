export function getSettings() {
  return fetch("http://" + process.env.API_URL + "/setting", {
    method: "GET",
  });
}

export function updateSettings(settings) {
  return fetch("http://" + process.env.API_URL + "/setting", {
    method: "POST",
    body: JSON.stringify(settings),
  });
}
