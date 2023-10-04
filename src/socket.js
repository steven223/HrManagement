const socketIo = require('socket.io');

let io;
const redisModule = require('./utils/redis');

function initSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
        }
    });
    const activeSessions = {};
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

       

        socket.on('setUserId', (userId) => {
            
            socket.join(userId);
            console.log("rooms joined", socket.rooms)
            socket.emit("sockerId", socket.id);

         
        })
        socket.on('disconnect', () => {
            console.log(`User disconnected (socket ID: ${socket.id})` + socket.rooms);
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized.');
    }
    return io;
}

module.exports = {
    initSocket,
    getIo,
};
