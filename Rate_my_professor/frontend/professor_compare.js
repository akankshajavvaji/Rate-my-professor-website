document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialProfessorName = urlParams.get("name");

  console.log("Initial professor name from URL:", initialProfessorName);

  // Utility function for stars
  function getStars(rating) {
      const full = "★ ".repeat(Math.floor(rating));
      const empty = "☆".repeat(5 - Math.floor(rating));
      return full + empty;
  }

  // Render a professor in a box (left or right)
  function renderProfessor(prof, boxIndex) {
      const box = document.querySelectorAll(".professor-box")[boxIndex];
      const professorNameLink = `<a href="professor.html?name=${encodeURIComponent(prof.professor_name)}">${prof.professor_name}</a>`;
      box.querySelector("h2").innerHTML = professorNameLink;
      box.querySelector(".dept").textContent = `${prof.department_name || 'N/A'} | ${prof.university_name || 'N/A'}`;
      box.querySelector(".rating-stars strong").textContent = `${prof.rating ? prof.rating.toFixed(1) : 'N/A'}/5`;
      box.querySelector(".rating-stars .stars").textContent = prof.rating ? getStars(prof.rating) : '☆☆☆☆☆';

      const bars = box.querySelectorAll(".rating-chart .bar");
      const distribution = prof.rating_distribution || [0, 0, 0, 0, 0]; // Default if not provided
      bars.forEach((bar, i) => {
          bar.style.width = `${distribution[4 - i] * 20}%`; // Assuming distribution is 1-5 count
      });

      const metrics = box.querySelectorAll(".metric");
      metrics[0].querySelector("strong").textContent = prof.would_take_again ? `${prof.would_take_again.toFixed(0)}%` : 'N/A';
      metrics[1].querySelector("strong").textContent = prof.difficulty ? prof.difficulty.toFixed(1) : 'N/A';
  }

  const searchInput = document.getElementById("professorSearchInput");
    const suggestionsContainer = document.getElementById("suggestionsContainer");

    searchInput.addEventListener("input", async function() {
        const query = this.value.trim();
        suggestionsContainer.style.display = "none"; // Hide previous suggestions

        if (query.length >= 2) { // Start suggesting after 2 characters (adjust as needed)
            try {
                const response = await fetch(`http://localhost:5000/api/professors/suggestions?query=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const suggestions = await response.json();
                displaySuggestions(suggestions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        }
    });

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = ""; // Clear previous suggestions
        if (suggestions && suggestions.length > 0) {
            const ul = document.createElement("ul");
            suggestions.forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;
                li.addEventListener("click", function() {
                    searchInput.value = this.textContent;
                    suggestionsContainer.style.display = "none";
                });
                ul.appendChild(li);
            });
            suggestionsContainer.appendChild(ul);
            suggestionsContainer.style.display = "block";
        } else {
            suggestionsContainer.style.display = "none"; // Hide if no suggestions
        }
    }

    const searchBar = document.querySelector(".search-bar-container .search-bar");
    searchBar.addEventListener("keypress", async function(event) {
        if (event.key === "Enter") {
            const professorName = this.value.trim();
            if (professorName) {
                loadAndRenderProfessor(professorName, 1); // Load into the right box (index 1)
            }
        }
    });

  // Function to fetch and render professor data
  async function loadAndRenderProfessor(name, boxIndex) {
      try {
          const response = await fetch(`http://localhost:5000/api/professors/compare/name/${encodeURIComponent(name)}`);
          if (!response.ok) throw new Error("Professor not found");
          const professorData = await response.json();

          // Convert string values to numbers (as we did in professor.js)
          if (professorData.rating) professorData.rating = parseFloat(professorData.rating);
          if (professorData.difficulty) professorData.difficulty = parseFloat(professorData.difficulty);
          if (professorData.would_take_again) professorData.would_take_again = parseFloat(professorData.would_take_again);

          renderProfessor(professorData, boxIndex);
      } catch (error) {
          console.error("Error loading professor:", error);
          const box = document.querySelectorAll(".professor-box")[boxIndex];
          box.querySelector("h2").textContent = "Error loading professor";
          box.querySelector(".dept").textContent = "";
          box.querySelector(".rating-stars strong").textContent = "N/A";
          box.querySelector(".rating-stars .stars").textContent = "☆☆☆☆☆";
          const bars = box.querySelectorAll(".rating-chart .bar");
          bars.forEach(bar => bar.style.width = '0%');
          const metrics = box.querySelectorAll(".metric");
          metrics[0].querySelector("strong").textContent = 'N/A';
          metrics[1].querySelector("strong").textContent = 'N/A';
      }
  }

  // Load the initial professor (if name is in URL)
  if (initialProfessorName) {
      loadAndRenderProfessor(initialProfessorName, 0); // Load into the left box (index 0)
  } else {
      // If no name in URL, load a default message or leave it empty
      renderProfessor({ name: "Select a Professor", department_name: "", university_name: "", rating: null, would_take_again: null, difficulty: null, rating_distribution: [0, 0, 0, 0, 0] }, 0);
  }

  // Handle search on Enter key
  document.querySelector(".search-bar").addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
          const input = e.target.value.trim();
          if (input) {
              loadAndRenderProfessor(input, 1); // Load the searched professor into the right box (index 1)
          } else {
              alert("Please enter a professor's name to search.");
          }
          this.value = ""; // Clear the search bar after searching
      }
  });

  // Initialize the right professor box with a default message
  renderProfessor({ name: "Search for a Professor", department_name: "", university_name: "", rating: null, would_take_again: null, difficulty: null, rating_distribution: [0, 0, 0, 0, 0] }, 1);
});