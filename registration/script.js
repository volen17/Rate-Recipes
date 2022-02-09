function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};


const registerForm = document.getElementById("signup-form");

function showError(errorMessage) {
    const errorDiv = document.getElementById("error");
    errorDiv.innerHTML = errorMessage;
}

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let usersItem = localStorage.getItem("users");
    const currentEmail = document.getElementById("email").value;
    const currentPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (currentEmail.length === 0 || currentPassword.length === 0 || confirmPassword.length === 0) {
        showError("All fields are required!");
        return;
    }
    if (!validateEmail(currentEmail)) {
        showError("Invalid email!");
        return;
    }
    if (currentPassword.length < 6) {
        showError("Password should be at least 6 characters!");
        return;
    }

    if (!usersItem) {
        if (confirmPassword === currentPassword) {
            localStorage.setItem("users", JSON.stringify([{
                email: currentEmail,
                password: currentPassword
            }]));
            localStorage.setItem("currentUser", JSON.stringify({
                email: currentEmail,
            }))
            window.location.href = "../recipes";
        }
        else showError("Passwords do not match!");
    } else {
        const users = JSON.parse(usersItem);

        const hasCurrentUser = users.filter(user => currentEmail === user.email).length !== 0;
        if (!hasCurrentUser) {
            if (confirmPassword === currentPassword) {
                users.push({
                    email: currentEmail,
                    password: currentPassword
                });
                localStorage.setItem("currentUser", JSON.stringify({
                    email: currentEmail,
                }))
                localStorage.setItem("users", JSON.stringify(users));
                window.location.href = "../recipes";
            }
            else showError("Passwords do not match!");
        }
        else {
            showError("User already exists!");
        }
    }
})