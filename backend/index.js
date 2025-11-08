const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const apiRoutes = require("./src/routes/api");
// Middleware to handle JSON data
app.use(express.json());
const frontendUrl = 'http://localhost:5173';
const corsOptions = {
    origin: frontendUrl,  // Allow requests only from your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true,    // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
