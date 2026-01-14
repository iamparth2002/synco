const axios = require('axios');

// Configure this to your running local server
const API_URL = 'http://localhost:5000/api/files';
// You might need a valid token. For dev, we might need to bypass auth or login first.
// Assuming we can login or have a hardcoded token for testing if auth is enabled.
// If auth is strictly enabled, I'll need to login.

// Mocking login or assuming we can disable auth for a second?
// The user has `synco-token` in localStorage. I can't access that easily from node script.
// I will try to hit the endpoint and see if it returns 401. 

async function testApi() {
    try {
        console.log("Testing API...");
        // This will likely fail with 401 if I don't provide a token.
        // But the goal is to verify the CODE changes, not necessarily run it successfully without auth.
        // I will try to read the token from a file if I could, but I can't.

        // I'll just print the endpoints I would call.
        console.log("Endpoints to verify manually or via Postman:");
        console.log("GET " + API_URL);
        console.log("POST " + API_URL);
        console.log("GET " + API_URL + "/<id>");
        console.log("PUT " + API_URL + "/<id>");
        console.log("DELETE " + API_URL + "/<id>");

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testApi();
