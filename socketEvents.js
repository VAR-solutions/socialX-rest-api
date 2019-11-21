exports = module.exports = function (io) {
    // Set socket.io listeners.
    io.on('connection', (socket) => {
        // console.log('a user connected');
        socket.on('connected', (data) => {
            socket.broadcast.emit('connected', (data));
        })
        // socket.on('chat message', function(msg){
        //     io.emit('chat message', msg);
        //   });
        // On conversation entry, join broadcast channel
        socket.on('enter conversation', (conversation) => {
            socket.join(conversation);
        });

        socket.on('leave conversation', (conversation) => {
            socket.leave(conversation);
            // console.log('left ' + conversation);
        })

        socket.on('new message', (conversation) => {
            io.sockets.in(conversation[0]).emit('new message', conversation[1]);
        });

        socket.on('disconnect', () => {
            //console.log('user disconnected');
        });
    });
}