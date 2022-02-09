function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const loginForm = document.getElementById("login-form");

function showError(errorMessage) {
    const errorDiv = document.getElementById("error");
    errorDiv.innerHTML = errorMessage;
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let usersItem = localStorage.getItem("users");
    const currentEmail = document.getElementById("email").value;
    const currentPassword = document.getElementById("password").value;
    if (currentEmail.length === 0 || currentPassword === 0) {
        showError("All fields are required!");
        return;
    }
    if (!validateEmail(currentEmail)) {
        showError("Invalid email!");
        return;
    }
    if (!usersItem) {
        showError("User with that email does not exist!");
    } else {
        const users = JSON.parse(usersItem);

        const user = users.filter(user => currentEmail === user.email);
        if (user.length !== 0) {
            if (user[0].password === currentPassword) {
                localStorage.setItem("currentUser", JSON.stringify(user[0]));
                window.location.href = "../recipes";
            } else {
                showError("Wrong password!");
            }
        } else {
            showError("User with that email does not exist!");
        }
    }
})