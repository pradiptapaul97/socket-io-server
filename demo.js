

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
  // transports: ['websocket']
});
io.on('connection', async (socket) => {

  io.emit('connected', `⚡: ${socket.id ? socket.id : 'socket'} user just connected!`);

  socket.on('isonline', async (data) => {
    try {

      let userId = mongoose.Types.ObjectId(data.userId)

      let isOnline = (data.isOnline == true || data.isOnline == 'true') ? true : false;
      let updated = {};

      if (isOnline == true) {
        updated = await userRepo.updateById({ isOnline: isOnline }, userId);
      }
      else {
        updated = await userRepo.updateById({ isOnline: isOnline, lastOnline: new Date() }, userId);
      }

      let payload = {
        _id: updated._id,
        isOnline: updated.isOnline,
        createdAt: updated.createdAt
      }

      let eventManager = await transRepo.allUserEventManager(userId);

      if (!_.isEmpty(chatRoom)) {
        eventManager.forEach((ele) => {
          let emitTo = `isOnline${(ele.event.event_manager.toString())}`;
          io.emit(emitTo, payload); // broadcast to all existinc users
        })
      }

      let emitTo = 'isonline' + (ele.toString());
      io.emit(emitTo, payload); // broadcast to all existinc users

    } catch (err) {
      logger.storeError({ api_url: 'reaction event(socket)', error_msg: err });
      console.log("ERROR: ", err);

    }
  })

})
