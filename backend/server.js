const http = require('http');
const app = require('./app');
const { initializeRealTimeCollaboration } = require('./utils/realTimeCollaboration');

const server = http.createServer(app);

initializeRealTimeCollaboration(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
