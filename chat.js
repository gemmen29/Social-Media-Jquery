$(document).ready(function() {

    $(document).on('hover', '[data-toggle="tooltip"]', function() {
        $('[data-toggle="tooltip"]').tooltip();
    })

    var currentFriendID = null;
    var messages = [];
    if (localStorage.getItem("messages") != null) {
        messages = JSON.parse(localStorage.getItem("messages"));
    }
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var users = [];

    function loadOldMessages() {
        for (var i = 0; i < messages.length; i++) {
            if (currentUser != null) {
                console.log("entered");
                var message = messages[i].Message;
                var image = currentUser.imgSrc;
                var imageTitle = currentUser.name;
                var messageTitle = messages[i].Date;
                $(document).find(".scrollbar").append(createMyMessage(imageTitle, image, messageTitle, message));
            }
        }
    }
    //loadOldMessages();

    function loadFriends() {
        if (localStorage.getItem("users") != null) {
            users = JSON.parse(localStorage.getItem("users"));
            for (var i = 0; i < users.length; i++) {
                if (users[i].ID != currentUser.ID) {
                    var image = users[i].imgSrc;
                    var friendName = users[i].name;
                    var id = users[i].ID;
                    $(document).find("#chats").append(createFriend(id, image, friendName));
                }
            }
        }
    }
    loadFriends();

    $("input").keydown(function(e) {
        if (e.key == 'Enter' && $("#messageInput").val().length > 0 && currentFriendID != null) {
            if (currentUser != null) {
                var message = $("#messageInput").val();
                var image = currentUser.imgSrc;
                var imageTitle = currentUser.name;
                var messageTitle = getDateInFormatAMPM(new Date());
                messages.push({
                    "senderID": currentUser.ID,
                    "receiverID": currentFriendID,
                    "Message": message,
                    "Date": messageTitle,
                });
                localStorage.setItem("messages", JSON.stringify(messages));
                $("#messageInput").val("");
                //$("#messageInput").blur();
            }
            // my message
            $(this).parent().parent().find(".scrollbar").append(createMyMessage(imageTitle, image, messageTitle, message));
            // another message
            //$(this).parent().parent().find(".scrollbar").append(createReplyMessage(imageTitle, image, messageTitle, message));
        }
    });

    $(document).on('click', '.friends', function() {
        currentFriendID = parseInt($(this).attr('data-id'));
        $(this).blur();
        var chatPanel = $(document).find(".scrollbar");
        chatPanel.empty();
        if (messages != null) {
            for (var i = 0; i < messages.length; i++) {
                var msg = messages[i];
                var messageTitle = msg.Date;
                var message = msg.Message;
                if (msg.senderID == currentUser.ID && msg.receiverID == currentFriendID) {
                    var image = currentUser.imgSrc;
                    var imageTitle = currentUser.name;
                    chatPanel.append(createMyMessage(imageTitle, image, messageTitle, message));
                } else if (msg.receiverID == currentUser.ID && msg.senderID == currentFriendID) {
                    var image;
                    var imageTitle
                    for (var j = 0; j < users.length; j++) {
                        if (users[j].ID == currentFriendID) {
                            image = users[j].imgSrc;
                            imageTitle = users[j].name;
                        }
                    }
                    chatPanel.append(createReplyMessage(imageTitle, image, messageTitle, message));
                }
            }
        }
    });


    function createMyMessage(imageTitle, image, messageTitle, message) {
        return '<div class="d-flex mb-2">' +
            '<img data-toggle="tooltip" data-placement="top" title="' +
            imageTitle + '" class="card-img-top mt-1 rounded-circle img-fluid chat-img" src=' +
            image + '><div data-toggle="tooltip" data-placement="top" title="' +
            messageTitle + '" class="ml-2 p-3 chat-message bg-info">' +
            message + '</div></div>';
    }

    function createReplyMessage(imageTitle, image, messageTitle, message) {
        return '<div class="d-flex mb-2 flex-row-reverse">' +
            '<img data-toggle="tooltip" data-placement="top" title="' +
            imageTitle + '" class="card-img-top mt-1 rounded-circle img-fluid chat-img" src="' +
            image + '"> <div data-toggle="tooltip" data-placement="top" title="' +
            messageTitle + '" class = "mr-2 p-3 chat-message">' +
            message + '</div></div>';
    }

    function createFriend(id, image, friendName) {
        return '<button class="btn col-12 d-flex p-2 friends" data-id = "' +
            id + '"><img style="width: 60px;height:60px" class="card-img-top rounded-circle img-fluid" src="' +
            image + '"><div class="d-flex flex-column ml-3 mt-1"><div class="h5">' +
            friendName + '</div><div class="small">Last Message</div></div></button>';
    }

    function getDateInFormatAMPM(date) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var day = date.getDate();
        var month = monthNames[date.getMonth()];
        var year = date.getFullYear()
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = month + " " + day + ", " + year + " at " +
            hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

});