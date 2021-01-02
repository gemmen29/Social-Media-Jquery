window.onload = function() {
    var users = [];
    if (localStorage.getItem("users") != null) {
        users = JSON.parse(localStorage.getItem("users"));
    }
    $(document).ready(function() {
        $("#create-account-button").addClass("disabled");

        var namePattern = /^[a-zA-Z]{3,}(\s[a-zA-Z]{3,})+$/
        var emailPattern = /^[a-zA-Z]{1}[a-zA-Z0-9]{0,}@[a-zA-Z]{1}[a-zA-Z0-9]{0,}\.[a-zA-Z]{1}[a-zA-Z0-9]{0,}$/
        var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

        $("input").on("input", function() {
            var name = $("#name").val();
            var email = $("#email").val();
            var password = $("#password").val();
            var repeatPassword = $("#repeat-password").val();

            if (namePattern.test(name) && emailPattern.test(email) &&
                passwordPattern.test(password) && passwordPattern.test(repeatPassword) && password === repeatPassword) {
                $("#create-account-button").removeClass("disabled");
            } else {
                $("#create-account-button").addClass("disabled");
            }

        })

        $("#create-account-button").click(function() {
            if ($(this).hasClass("disabled") == false) {
                var name = $("#name").val();
                var email = $("#email").val();
                var password = $("#password").val();

                for (var i = 0; i < users.length; i++) {
                    if (users[i].email == email) {
                        alert("Email already Registered");
                        return;
                    }
                }
                $("#name").val("");
                $("#email").val("");
                $("#password").val("");
                $("#repeat-password").val("");
                $("#create-account-button").addClass("disabled");

                users.push({ "ID": users.length, "name": name, "email": email, "password": password, "imgSrc": "img_avatar1.png" });
                localStorage.setItem("users", JSON.stringify(users));
                alert("You Successfully Registered");
                open("login.html", "_self");
            }
        })

        $("#login").click(function() {
            open("login.html", "_self");
        });

        $(document).on('keydown', function(e) {
            if (e.key === 'Enter') {
                $("#create-account-button").trigger('click');
            }
        });
    })
}