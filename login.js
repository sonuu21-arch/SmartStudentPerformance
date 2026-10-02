const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {

        document.getElementById("loginMessage").innerText =
            "Login successful!";

        setTimeout(function() {

            window.location.href = "index.html";

        }, 1000);

    }

    else {

        document.getElementById("loginMessage").innerText =
            "Invalid username or password.";

    }

});

