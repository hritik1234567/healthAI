
// Add an event listener for the button click
document.getElementById("signuppage").addEventListener("click", function() {
    // Perform the redirection when the button is clicked
    // Replace 'target-page.html' with the actual URL of the page you want to redirect to
    targetURL = "./signup.html";
    window.open(targetURL, "_blank");
});

function saveFormData() {
    // Fetch form data
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var phoneNumber = document.getElementById('phoneNumber').value;

    // Send form data to MongoDB (you need to implement this)
    // Example code to send form data using fetch API
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            phoneNumber: phoneNumber
        })
    }).then(response => {
        // Handle response
        if (response.ok) {
            // Redirect to login page
            window.location.href = './frontendfiles/login.html';
        } else {
            console.error('Failed to save form data');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
        email: document.getElementById('emailInput').value,
        password: document.getElementById('passwordInput').value,
    };

    try {
        const response = await fetch('https://healbackend-1.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            // Handle successful login (e.g., display a message or redirect)
            //alert('Login successful!');
            
            localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.patient));
            window.location.href = '/'; // Ensure index.html is correctly referenced
        } else {
            // Handle errors (e.g., display an error message)
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});


