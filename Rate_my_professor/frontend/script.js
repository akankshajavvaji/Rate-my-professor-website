let professors = [];
let universities = [];

// Fetch professors and universities from the API
fetch('http://localhost:5000/api/professors')
  .then(res => res.json())
  .then(data => {
    professors = data.map(p => p.professor_name); // assuming each professor has a 'professor_name' field
  })
  .catch(err => {
    console.error('Failed to fetch professors:', err);
  });

// Fetch universities
fetch('http://localhost:5000/api/universities')
  .then(res => res.json())
  .then(data => {
    universities = data.map(u => u.university_name); // assuming each university has a 'university_name' field
  })
  .catch(err => {
    console.error('Failed to fetch universities:', err);
  });

// Function to show suggestions for professors or universities
function showSuggestions() {
  let input = document.getElementById('searchInput').value.toLowerCase();
  let suggestionsBox = document.getElementById('suggestions');
  suggestionsBox.innerHTML = "";

  if (input === "") {
    suggestionsBox.style.display = "none";
    return;
  }

  let filteredSuggestions = [];

  const searchMode = document.getElementById("searchInput").placeholder === "Search by professor";

  if (searchMode) {
    // Filter professors
    filteredSuggestions = professors.filter(name => name.toLowerCase().startsWith(input));
  } else {
    // Filter universities
    filteredSuggestions = universities.filter(name => name.toLowerCase().startsWith(input));
  }

  if (filteredSuggestions.length > 0) {
    filteredSuggestions.forEach(name => {
      let li = document.createElement('li');
      li.textContent = name;
      li.onclick = function () {
        document.getElementById('searchInput').value = name;
        suggestionsBox.style.display = "none";
      };
      suggestionsBox.appendChild(li);
    });

    suggestionsBox.style.display = "block";
  } else {
    suggestionsBox.style.display = "none";
  }
}

// Function to clear search input
function clearSearch() {
  document.getElementById('searchInput').value = "";
  document.getElementById('suggestions').style.display = "none";
}

// Modal handling
const loginModal = document.getElementById("loginModal");
const studentModal = document.getElementById("studentModal");
const profModal = document.getElementById("profModal");

document.getElementById("loginSignupBtn").onclick = () => {
  loginModal.style.display = "block";
};

function closeModal() {
  loginModal.style.display = "none";
  studentModal.style.display = "none";
  profModal.style.display = "none";
}

function switchToStudent() {
  loginModal.style.display = "none";
  studentModal.style.display = "block";
}

function switchToProfessor() {
  studentModal.style.display = "none";
  profModal.style.display = "block";
}

function switchToLogin() {
  studentModal.style.display = "none";
  profModal.style.display = "none";
  loginModal.style.display = "block";
}

// Close when clicking outside modal
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    closeModal();
  }
};

// Toggle between search by professor and university
const searchBar = document.getElementById("searchInput");
const toggleBtn = document.getElementById("toggleSearch");

toggleBtn.addEventListener("click", () => {
  console.log('Toggling search mode...');
  if (toggleBtn.textContent === "Search by university") {
    searchBar.placeholder = "Search by university";
    toggleBtn.textContent = "Search by professor";
  } else {
    searchBar.placeholder = "Search by professor";
    toggleBtn.textContent = "Search by university";
  }
});

// Handling Enter key to trigger search
searchBar.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const query = searchBar.value.trim();
    if (query) {
      const searchMode = searchBar.placeholder === "Search by professor";
      if (searchMode) {
        window.location.href = `professor.html?name=${encodeURIComponent(query)}`;
      } else {
        window.location.href = `university.html?name=${encodeURIComponent(query)}`;
      }
    }
  }
});

// REGISTER FUNCTION
document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const full_name = document.getElementById('signup-fullname').value;
  const email = document.getElementById('signup-email').value;
  const user_type = document.getElementById('signup-usertype').value;
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, user_type, username, password })
    });

    const result = await response.json();
    if (response.ok) {
      alert('Registration successful! You can now log in.');
      document.getElementById('signupForm').reset();
      switchToLogin(); // Show login modal after signup
    } else {
      alert(result.error || 'Registration failed.');
    }
  } catch (error) {
    console.error('Signup Error:', error);
    alert('An error occurred during registration.');
  }
});

// LOGIN FUNCTION
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
      alert('Login successful!');
      localStorage.setItem('token', result.token);
      document.getElementById('loginForm').reset();
      closeModal(); // Hide the modal on successful login
    } else {
      alert(result.error || 'Login failed.');
    }
  } catch (error) {
    console.error('Login Error:', error);
    alert('An error occurred during login.');
  }
});

document.getElementById('searchInput').addEventListener('blur', () => {
  setTimeout(() => {
    document.getElementById('suggestions').style.display = 'none';
  }, 150); // Delay to allow click on suggestion
});

document.getElementById('searchInput').addEventListener('focus', () => {
  if (document.getElementById('searchInput').value.trim() !== "") {
    showSuggestions();
  }
});
