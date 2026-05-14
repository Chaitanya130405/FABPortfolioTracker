/**
 * Compatibility wrapper for previous entrypoint.
 * Keeps existing nodemon or scripts that reference `server.js` working.
 */
require("./src/server.js");
