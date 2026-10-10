const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  XSHostel REST API Server is running!               `);
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Health API  : http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
