function openChatbot() {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (!sessionData) {
        sessioncreation();
    }
    window.open("chatbot.html", "_blank", "width=800,height=600");
}

async function sessioncreation() {
    try {
        const response = await fetch('https://maxbot-9ays.onrender.com/create_chat', {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to get session id');
        }
        const responseData = await response.json();
        const sessionData = responseData[0];
        // Convert the responseData to a JSON string and store it in localStorage
        localStorage.setItem("sessionData", JSON.stringify(sessionData));

    } catch (error) {
        console.error('Error getting session_id:', error);
        alert('Error in getting session. Please try again.');
    }
}

// displaying the my-appointment none
document.addEventListener('DOMContentLoaded', () => {
            const appointmentsLink = document.getElementById('my-appointments-link');
            const chatbotlink = document.getElementById('my-chatbot');
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!user || !token) {
                appointmentsLink.style.display = 'none';
                chatbotlink.style.display='none';
            }
        });
        // Fetch appointment  data from backend
        document.querySelector('.nav-link[href="#my-appointments"]').addEventListener('click', async () => {
    try {
        // Get patient_id from local storage
        const patient = JSON.parse(localStorage.getItem('user'));
        const patientId=patient._id;
        console.log(patientId);
        if (!patientId) {
            alert('Patient ID is not available in local storage.');
            return;
        }

        // Make POST request to fetch appointments
        const response = await fetch('https://healbackend-1.onrender.com/api/appointment/myappointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({patient_id: patient._id }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }

        const appointments = await response.json();
        if (!appointments.length) {
                    alert('No appointments are booked till now');
                    return;
                }
        const appointmentsTableBody = document.getElementById('appointmentsTableBody');
        appointmentsTableBody.innerHTML = ''; // Clear existing data

        // Populate table with fetched appointments
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.doctor_id}</td>
                
                <td>${appointment.appointmentTime}</td>
                
            `;
            appointmentsTableBody.appendChild(row);
        });

        // Show the modal
        const appointmentsModal = new bootstrap.Modal(document.getElementById('appointmentsModal'));
        appointmentsModal.show();
    } catch (error) {
        console.error('Error fetching appointments:', error);
        alert('An error occurred while fetching appointments. Please try again later.');
    }
});

     
        // Fetch doctor data from backend with optional search query
async function fetchDoctorData(searchQuery = '') {
    try {
        const response = await fetch(`https://healbackend-1.onrender.com/api/doctors?search=${searchQuery}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
async function postAppointment(appointmentData) {
            const confirmAppointmentButton = document.getElementById('confirmAppointmentButton');

            try {
                confirmAppointmentButton.disabled = true;
                const response = await fetch('https://healbackend-1.onrender.com/api/appointment/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(appointmentData)
                });
                if (!response.ok) {
                    throw new Error('Failed to book appointment');
                }
                const responseData = await response.json();
                const message=responseData.message;
                alert(message);
                confirmAppointmentButton.disabled = false;
                const doctorDetailsModal = bootstrap.Modal.getInstance(document.getElementById('doctorDetailsModal'));
                doctorDetailsModal.hide();
            } catch (error) {
                console.error('Error booking appointment:', error);
                alert('Error booking appointment. Please try again.');
            }
        }

        // Handle confirm appointment button click
        document.getElementById('confirmAppointmentButton').addEventListener('click', async () => {
            const doctorId = document.getElementById('doctorId').textContent;
            const appointmentDate = document.getElementById('appointmentDate').value;
            const patient = JSON.parse(localStorage.getItem('user'));
        
            if (!doctorId || !appointmentDate || !patient) {
                alert('Missing appointment details. Please try again.');
                return;
            }

            const appointmentData = {
                doctor_id: doctorId,
                patient_id: patient._id,
                //patientContact: patient.phoneNumber,
                appointmentTime:appointmentDate
            };

            await postAppointment(appointmentData);
        });



// Dynamically create doctor cards
async function createDoctorCards(searchQuery = '') {
    const doctorData = await fetchDoctorData(searchQuery);
    const doctorCardsContainer = document.getElementById('doctor-cards');
    doctorCardsContainer.innerHTML = ''; // Clear previous cards

    doctorData.slice(0, 4).forEach((doctor, index) => {
        const card = `
            <div class="card" style="width: 18rem;">
                <img src="../images/doctor${index + 1}.jpeg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${doctor.Name}</h5>
                    <h5 class="card-text">${doctor.Speciality}</h5>
                    <h6 class="card-text">${doctor.Location}</h6>
                    <button class="btn btn-warning" onclick="showDoctorDetails(${doctor.doctor_id})">Book Appointment</button>
                </div>
            </div>
        `;
        doctorCardsContainer.insertAdjacentHTML('beforeend', card);
    });
}

// Handle doctor search
function searchDoctors() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    createDoctorCards(searchQuery);
}

// Fetch doctor details by ID from backend
async function fetchDoctorDetails(doctor_id) {
    try {
        const response = await fetch(`https://healbackend-1.onrender.com/api/doctors/${doctor_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Show doctor details in a modal
async function showDoctorDetails(doctorId) {
    const doctorDetails = await fetchDoctorDetails(doctorId);
    if (doctorDetails) {
        const doctorDetailsContainer = document.getElementById('doctor-details');
        doctorDetailsContainer.innerHTML = `
            <p><strong>Name:</strong> ${doctorDetails.Name}</p>
            <p><strong>Specialization:</strong> ${doctorDetails.Speciality}</p>
            <p><strong>Location:</strong> ${doctorDetails.Location} </p>
            <p><strong>Contact:</strong> ${doctorDetails.PhoneNumber}</p>
            <p id="doctorId" style="display:none"> ${doctorDetails.doctor_id}</p>
        `;
        const appointmentDateInput = document.getElementById('appointmentDate');
        const today = new Date();
        const maxDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // Next 7 days
        appointmentDateInput.min = today.toISOString().split('T')[0]; // Set min date to today
        appointmentDateInput.max = maxDate.toISOString().split('T')[0];

        const doctorDetailsModal = new bootstrap.Modal(document.getElementById('doctorDetailsModal'));
        doctorDetailsModal.show();
    }
}

// Check session on page load and update navbar
async function checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    const authButtons = document.getElementById('auth-buttons');

    if (token && user) {
        const userData = JSON.parse(user);
        authButtons.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-person-fill" style="color: yellow;">${userData.name}</i>
                <button type="button" class="btn btn-warning ms-2" onclick="logout()">Logout</button>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button type="button" class="btn btn-warning me-2" onclick="window.location.href='/healthAI/html/login.html'">Login</button>
            <button type="button" class="btn btn-warning" onclick="window.location.href='/healthAI/html/signup.html'">Sign up</button>
        `;
    }
}

async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionData');
    window.location.href = '/healthAI/html/login.html';
}

window.onload = function() {
    checkSession();
    createDoctorCards();
};
