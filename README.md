### Symposium
#### Screenshots
<p align="center">
  <img src="https://raw.githubusercontent.com/jafarlihi/symposium/master/repo/screenshots/screenshots.png?token=AKL72S64U56LXZD67FZTX7S6XVFKU">
</p>

#### Installation
Write down PostgreSQL details, JWT signing secret, and port to `./api/config.json`.
##### Local
Write API URL to `build.sh` "export API_URL=" line.

Run `build.sh` and then run `./build/api`.
##### Dockerfile
Write API URL to line 7 of Dockerfile, as an ENV directive.

Change EXPOSE-d port at line 18 to match the one specified in `config.json`.

Build the image.
