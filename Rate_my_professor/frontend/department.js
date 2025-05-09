// Sample professors array (to be replaced with dynamic data)
const professors = [
  {
    id: "david-holmes",
    name: "David Holmes",
    department: "Mathematics",
    university: "University of Michigan",
    rating: 4.0,
    ratingsCount: 21,
    wouldTakeAgain: "79%",
    difficulty: 4.5
  },
  {
    id: "jane-doe",
    name: "Jane Doe",
    department: "Mathematics",
    university: "University of Michigan",
    rating: 4.2,
    ratingsCount: 18,
    wouldTakeAgain: "83%",
    difficulty: 4.3
  },
  {
    id: "alex-smith",
    name: "Alex Smith",
    department: "Mathematics",
    university: "University of Michigan",
    rating: 3.9,
    ratingsCount: 15,
    wouldTakeAgain: "75%",
    difficulty: 4.1
  },
  // Add more professors here
];

// Get the department dropdown element and professor list container
const departmentSelect = document.querySelector("select");
const listContainer = document.getElementById("professor-list");

// Function to render professors based on selected department
function renderProfessors(department) {
  listContainer.innerHTML = ''; // Clear the existing list
  const filteredProfessors = professors.filter(prof => prof.department === department);

  filteredProfessors.forEach((prof) => {
    const card = document.createElement("div");
    card.classList.add("professor-card");

    card.innerHTML = `
      <div class="prof-left">
        <div class="prof-rating">
          ${prof.rating}
          <small>${prof.ratingsCount} ratings</small>
        </div>
        <div class="prof-details">
          <h3><a href="professor.html?id=${prof.id}" class="prof-name-link">${prof.name}</a></h3>
          <p>${prof.department}</p>
          <p>${prof.university}</p>
          <p>${prof.wouldTakeAgain} would take again | ${prof.difficulty} difficulty</p>
        </div>
      </div>
      <div class="bookmark-icon">
        <i class="fa-regular fa-bookmark"></i>
      </div>
    `;

    listContainer.appendChild(card);
  });
}

// Initial render with all professors (or any default department)
renderProfessors("Mathematics");

// Listen for department change and filter professors
departmentSelect.addEventListener("change", (e) => {
  renderProfessors(e.target.value);
});

// Get the search bar element
const searchBar = document.querySelector(".search-bar");

// Function to filter professors based on search input
function searchProfessors(query) {
  listContainer.innerHTML = ''; // Clear the existing list
  const filteredProfessors = professors.filter(prof => prof.name.toLowerCase().includes(query.toLowerCase()));

  filteredProfessors.forEach((prof) => {
    const card = document.createElement("div");
    card.classList.add("professor-card");

    card.innerHTML = `
      <div class="prof-left">
        <div class="prof-rating">
          ${prof.rating}
          <small>${prof.ratingsCount} ratings</small>
        </div>
        <div class="prof-details">
          <h3><a href="professor.html?id=${prof.id}" class="prof-name-link">${prof.name}</a></h3>
          <p>${prof.department}</p>
          <p>${prof.university}</p>
          <p>${prof.wouldTakeAgain} would take again | ${prof.difficulty} difficulty</p>
        </div>
      </div>
      <div class="bookmark-icon">
        <i class="fa-regular fa-bookmark"></i>
      </div>
    `;

    listContainer.appendChild(card);
  });
}

// Event listener for real-time search
searchBar.addEventListener("input", (e) => {
  searchProfessors(e.target.value);
});
