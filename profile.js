window.onload = function() {
    $(document).ready(function() {
        $.ajax({
            url: 'posts.json',
            type: 'get',
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    var res = results[i];
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                    var today = new Date();
                    var date = today.getDate() + " " + monthNames[today.getMonth()] + " , " + (today.getFullYear() % 2000);
                    var time = " [" + today.getHours() + ":" + today.getMinutes() + "] ";
                    $("#post-button").parent().after(createPost(res.image, res.name, time, date, res.post, null));
                    //console.log(res.image + " " + res.name + " " + time + " " + date + " " + res.post)
                }
                //$(".profile-post").toggleClass("profile-post");
                $(".profile-comment").attr("src", currentUser.imgSrc);
                //console.log(results);
            },
            error: function(xhr) {
                console.log(xhr.statusText)
            },
        });
        var postFileName = null;
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));

        var posts = []
        if (localStorage.getItem("posts") != null) {
            posts = JSON.parse(localStorage.getItem("posts"));
        }
        for (var i = 0; i < posts.length; i++) {
            var post = posts[i];
            var image = post.image;
            var user = post.name;
            var time = post.time;
            var date = post.date;
            var postText = post.postText;
            var postImage = post.postImage;
            $("#post-button").parent().after(createPost(image, user, time, date, postText, postImage));
        }
        $(".profile-comment").attr("src", currentUser.imgSrc);

        if (currentUser != null) {
            $("#profile-name").text(currentUser.name);
            $("#profile").attr('src', currentUser.imgSrc);
        }

        $("#notification").click(function() {
            var value = parseInt($("#notification-value").text());
            $("#notification-value").text(value + 1);
        });

        $("#post-button").addClass("disabled");

        $("#post-text").on("input", function() {
            if ($("#post-text").val().length >= 10) {
                $("#post-button").removeClass("disabled");
            } else {
                $("#post-button").addClass("disabled");
            }
        });

        function createPostDynamic() {
            if ($(this).hasClass("disabled") == false) {
                var post = $("#post-text").val();

                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                var today = new Date();
                var date = today.getDate() + " " + monthNames[today.getMonth()] + " , " + (today.getFullYear() % 2000);
                //var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = " [" + today.getHours() + ":" + today.getMinutes() + "] ";
                var image = $("#profile").attr("src");
                $("#post-text").val("");
                $("#post-button").addClass("disabled");
                $(this).parent().after(createPost(image, currentUser.name, time, date, post, postFileName));
                posts.push({ "image": image, "name": currentUser.name, "time": time, "date": date, "postText": post, "postImage": postFileName });
                localStorage.setItem("posts", JSON.stringify(posts));
                postFileName = null;
            }
        }

        function createPost(image, user, time, date, post, postImage) {
            var element = '<div class="card post"><div style="width:100%;"><img style="width: 50px;height:50px" class="card-img-top rounded-circle img-fluid profile-post" src="' +
                image + '" alt="Card image"><span style="padding-left:5px">' +
                user + '</span><span class="d-inline-block" style="position: absolute;top: 40px;left:70px;font-size: 13px;color:rgb(201, 202, 202)">' +
                time + '</span><span style="float:right;position: relative;top:10px">' +
                date + '</span></div><p style="margin-top:25px;">' +
                post + '</p>';
            if (postImage != null) {
                element += '<div class="mx-auto" style="width:80%;">' +
                    '<img class="card-img-top img-fluid" src="' + postImage +
                    '" alt="Card image"></div>';
            }
            element += '<hr style="background-color:white">' +
                '<div class="mt-3 comment-parent"><div class="d-flex d-inline-block"><img style="width: 50px;height:50px" class="card-img-top rounded-circle img-fluid profile-comment" src="' +
                image + '" alt="Card image"><div class="d-inline-block" style="width:100%"><input class="comment-input" type="text"></div></div></div><div style="margin-top:15px">' +
                '<button class="btn post-buttons like"><i class="fas fa-thumbs-up"></i> Like</button><button class="btn post-buttons comment"><i class="fas fa-comment"></i> Comment</button>' +
                '<button style="background-color:#d83a3a" class="btn post-buttons delete"><i class="far fa-trash-alt"></i> Delete</button></div></div>'
            return element;
        }

        $("#post-button").click(createPostDynamic);
        $("#post-text").keydown(function(e) {
            if (e.key === 'Enter') {
                $("#post-button").trigger('click');
            }
        });

        $("#browse-image").click(function() {
            $('#file-post-image').trigger('click');
        })

        $("#file-post-image").change(function(e) {
            postFileName = "images/posts/" + e.target.files[0].name;
        })

        $("#change-profile-image").click(function() {
            $('#change-profile-dialog').trigger('click');
        })

        $("#change-profile-dialog").change(function(e) {
            //console.log($(this).val);
            var file = e.target.files[0].name;
            $("#profile").attr('src', "images/profile/" + file);
            $(".profile-post").attr('src', "images/profile/" + file);
            $(".profile-comment").attr('src', "images/profile/" + file);

            if (currentUser != null) {
                currentUser.imgSrc = $("#profile").attr("src");
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                var users = [];
                if (localStorage.getItem("users") != null) {
                    users = JSON.parse(localStorage.getItem("users"));

                    for (var i = 0; i < users.length; i++) {
                        if (currentUser.ID === users[i].ID) {
                            users[i].imgSrc = currentUser.imgSrc;
                            break;
                        }
                    }

                    localStorage.setItem("users", JSON.stringify(users));
                }
            }
        });

        $(document).on('click', '.like', function() {
            $(this).toggleClass("like-button post-buttons");
            $(this).blur();
        });

        $(document).on('click', '.comment', function() {
            $(this).blur();
            $(this).parent().parent().find(".comment-parent").toggleClass("d-none");
            $(this).parent().parent().find(".delete-comment").toggleClass("d-none");
        });


        $(document).on('click', '.delete', function() {
            $(this).parent().parent().remove();
        });

        $(document).on('click', '.delete-comment', function() {
            $(this).parent().remove();
        });

        $(document).on('keydown', '.comment-input', function(e) {
            var image = $("#profile").attr("src");
            var comment = $(this).val();
            if (e.key === 'Enter') {
                $(this).val("");
                $(this).parent().parent().parent().before(
                    '<div class="d-flex flex-row mt-3"><div style="background-color:#010225;border:2px solid #ffffff96" class="comment-parent"><div class="d-flex d-inline-block">' +
                    '<img style="width: 50px;height:50px" class="card-img-top rounded-circle img-fluid profile-post" src="' +
                    image + '" alt="Card image"><div class="d-inline-block" style="width:100%"><input value="' +
                    comment + '" style="background-color:#e6dfdf00;border:0px" class="comment-input" type="text" readonly></div></div></div>' +
                    '<button class="btn btn-danger ml-2 rounded-circle delete-comment"><span class="h4">&times;</span></button></div>'
                );
            }
        });
    })
}
