var app;

$(function() {
  app = {
    server: 'http://127.0.0.1:3000/classes/messages',
    username: 'anonymous',
    roomname: 'lobby',
    lastId: 0,
    allRooms: {
      _newRoom: true,
      lobby: true
    },
    friends: {},
    refresh: false,

    init: function() {
      app.username = window.location.search.split('=')[1];

      app.$main = $('#main');
      app.$rooms = $('#roomSelect');
      app.$message = $('#message');
      app.$chatroom = $('#chats');
      app.$submit = $('#send');
      app.$spinner = $('#spinner');

      app.$rooms.on('change', app.saveRoom);
      app.$submit.on('submit', app.handleSubmit);
      app.$chatroom.on('click', '.username', app.addFriend);

      app.hideSpinner();

      app.fetch();
      setInterval(app.fetch, 3000);
    },
    fetch: function() {
      $.ajax({
        url: app.server,
        type: 'GET',
        data: { order: '-createdAt' },
        contentType: 'application/json',
        success: function(data) {
          if(data.results && data.results.length > 0) {
            app.checkChatChanges(data.results);
          }
        },
        error: function(data) {
          console.error('chatterbox: failed to retrieve messages: ', data);
        }
      });
    },
    send: function(data) {
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(data) {
          console.log('Message sent!');
        },
        error: function(data) {
          console.error('Message failed to send: ', data);
        }
      });
    },
    handleSubmit: function(event) {
      var message = {
        username: app.username,
        message: app.$message.val(), // Modified to be message instead of text
        roomname: app.roomname || 'lobby'
      };
      app.send(message);
      app.$message.val('');
      app.showSpinner();
      app.fetch();

      // Prevent page refresh
      event.preventDefault();
    },
    clearMessages: function() {
      app.$chatroom.html('');
    },
    checkChatChanges: function(data) {
      var lastResultId = data[data.length-1].objectId;

      // If no change in message count, roomname or friends return.
      if(lastResultId === app.lastId && !app.refresh) {
        return;
      }

      // Something changed, clear the messages and reprint data.
      app.refresh = false;
      app.lastId = lastResultId;
      app.populateMessages(data);
      app.populateRooms(data);
    },
    populateMessages: function(data) {
      app.showSpinner();
      app.clearMessages();
      for(var i = 0; i < data.length; i++) {
        data[i].roomname = data[i].roomname || 'lobby';
        if(data[i].roomname === app.roomname) {
          app.addMessage(data[i]);
        }
      }
      app.hideSpinner();
    },
    addMessage: function(message) {
      var $chat = $('<div class="chat" />');
      var $username = $('<span class="username" />');
      if(app.friends[message.username] === true) {
        $username.addClass('friend');
      }
      $username.text(message.username + ': ').attr('data-username', message.username)
        .attr('data-roomname', message.roomname).appendTo($chat);
      var $message = $('<span class="msg"/>');
      $message.text(message.message).appendTo($chat); // changed message.text to be message.message
      $chat.append(' ');
      if(message.createdAt) {
        var $time = $('<span class="time"/>');
        $time.text(moment(message.createdAt).fromNow()).appendTo($chat);
      }
      app.$chatroom.append($chat);
    },
    addRoom: function(roomName) {
      app.allRooms[roomName] = true;
      var $room = $('<option class="room" />');
      $room.val(roomName).text(roomName);
      app.$rooms.append($room);
    },
    populateRooms: function(data) {
      for(var i = 0; i < data.length; i++) {
        if(!app.allRooms[data[i].roomname]) {
          app.addRoom(data[i].roomname);
        }
      }
      app.$rooms.val(app.roomname);
    },
    saveRoom: function() {
      app.showSpinner();
      if(app.$rooms.val() === '_newRoom') {
        var roomName = prompt('Please enter a roomname');
        if(roomName) {
          if(!app.allRooms[roomName]) {
            app.addRoom(roomName);
          }
          app.roomname = roomName;
        }
      } else {
        app.roomname = app.$rooms.val();
      }
      app.refresh = true;
      app.fetch();
    },
    addFriend: function(event) {
      var user = $(event.currentTarget).attr('data-username');

      if(user) {
        app.friends[user] = true;
      }
      app.refresh = true;
      app.fetch();
    },
    showSpinner: function() {
      app.$spinner.fadeTo(25, 100, function () {
        app.$spinner.css('visibility', 'visible');
      });
    },
    hideSpinner: function() {
      app.$spinner.fadeTo(500, 0, function () {
        app.$spinner.css('visibility', 'hidden');
      });
    }
  };
}());