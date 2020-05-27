### Symposium

Demo / support forums: http://symposium.sytes.net/

#### Installation
Write down PostgreSQL details, JWT signing secret, and port to `./api/config.json`.

##### Local
Write API URL to `build.sh` "export API_URL=" line.

Make sure you have Go and NPM installed.

Run `build.sh` and then run `./build/api`.

##### Dockerfile
Write API URL to line 7 of Dockerfile, as an ENV directive.

Change EXPOSE-d port at line 18 to match the one specified in `config.json`.

Build the image.
