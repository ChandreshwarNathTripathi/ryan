// Import the configured Express app
const app = require("./app");

// Define port number from environment variable or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start server and listen for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`XSHostel backend running on http://localhost:${PORT}`);
});
