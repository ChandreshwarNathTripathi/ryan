
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.log("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
// Import the configured Express app
const app = require("./app");

// Define port number from environment variable or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start server and listen for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`XSHostel backend running on http://localhost:${PORT}`);
});
