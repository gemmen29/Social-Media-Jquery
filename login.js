window.onload = function() {
    $(document).ready(function() {
        var users = [];
        if (localStorage.getItem("users") != null) {
            users = JSON.parse(localStorage.getItem("users"));
        }
        $("#login-button").click(function() {
            var email = $("#email").val();
            var password = $("#password").val();
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    if (users[i].password == password) {
                        localStorage.setItem("currentUser", JSON.stringify(users[i]));
                        //setTimeout(function() {
                        open("profile.html", "_self");
                        //}, 0);
                    } else {
                        alert("Not valid password");
                    }
                }
            }
            alert("Email Not Registered");
        });

        $(document).on('keydown', function(e) {
            if (e.key === 'Enter') {
                $("#login-button").trigger('click');
            }
        });

        $("#signup").click(function() {
            open("index.html", "_self");
        });
    })
}