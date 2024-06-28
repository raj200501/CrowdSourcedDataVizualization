const { Server } = require("socket.io");

const io = new Server();

exports.initializeRealTimeCollaboration = (server) => {
    io.attach(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('collaborate', (data) => {
            // Broadcast data to all clients
            io.emit('collaborate', data);
        });
    });
};
