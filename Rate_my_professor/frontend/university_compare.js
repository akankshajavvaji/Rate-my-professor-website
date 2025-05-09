// DOM Elements for left panel
const uniLeftName = document.querySelector(".left-panel h2");
const uniLeftLocation = document.querySelector(".left-panel .location");
const uniLeftRating = document.querySelector(".left-panel .overall-score");
const leftRatingsList = document.querySelector(".left-panel .categories-columns ul");

// DOM Elements for right panel
const searchInput = document.querySelector(".search-bar"); // Search input field
const suggestionBox = document.getElementById("suggestions"); // Suggestion dropdown
const uniRightName = document.querySelector(".right-panel h2");
const uniRightLocation = document.querySelector(".right-panel .location");
const uniRightRating = document.querySelector(".right-panel .overall-score");
const rightRatingsList = document.querySelector(".right-panel .categories-columns ul");

// Store the name of the first compared university
let comparedUniversity1 = null;

window.onload = () => {
  // Get the 'uni1' parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const university1Name = urlParams.get('uni1');

  if (university1Name) {
    comparedUniversity1 = university1Name;
    fetchUniversityData(university1Name, true); // Fetch data for the left panel
  }
};

async function fetchUniversityData(name, isLeft) {
  try {
    const response = await fetch(`http://localhost:5000/api/universities/name/${encodeURIComponent(name)}`);
    if (!response.ok) {
      console.error(`Response:`, response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayUniversityComparison(data.university, isLeft);
  } catch (error) {
    console.error('Error fetching university data for comparison:', error);
    alert(`Error fetching data for ${name}. Please try again.`);
  }
}

function displayUniversityComparison(data, isLeft) {
    const university = data.university;
    const reviews = data.reviews;
  
    const nameElement = isLeft ? uniLeftName : uniRightName;
    const locationElement = isLeft ? uniLeftLocation : uniRightLocation;
    const ratingElement = isLeft ? uniLeftRating : uniRightRating;
    const ratingsListElement = isLeft ? leftRatingsList : rightRatingsList;
  
    nameElement.textContent = university.university_name;
    locationElement.textContent = university.location;
    ratingElement.textContent = university.rating ? parseFloat(university.rating).toFixed(1) : 'N/A';
    ratingsListElement.innerHTML = ""; // Clear previous ratings

    let sumOverallRating = 0;
    if (reviews && reviews.length > 0) {
      reviews.forEach(review => {
        sumOverallRating += parseFloat(review.rating);
      });
      ratingElement.textContent = (sumOverallRating / reviews.length).toFixed(1);
    } else {
      ratingElement.textContent = 'N/A';
    }

    // Calculate average ratings from reviews
    let avgLocation = 0;
    let avgReputation = 0;
    let avgOpportunity = 0;
    let avgHappiness = 0;
    let avgInternet = 0;
    let avgFacility = 0;
    let avgClubs = 0;
    let avgSocial = 0;
    let avgFood = 0;
    let avgSafety = 0;
  
    if (reviews && reviews.length > 0) {
      reviews.forEach(review => {
        avgLocation += parseFloat(review.location);
        avgReputation += parseFloat(review.reputation);
        avgOpportunity += parseFloat(review.opportunity);
        avgHappiness += parseFloat(review.happiness);
        avgInternet += parseFloat(review.internet);
        avgFacility += parseFloat(review.faculty);
        avgClubs += parseFloat(review.clubs);
        avgSocial += parseFloat(review.social);
        avgFood += parseFloat(review.food);
        avgSafety += parseFloat(review.safety);
      });
  
      const numReviews = reviews.length;
      avgLocation = numReviews > 0 ? (avgLocation / numReviews).toFixed(1) : 'N/A';
      avgReputation = numReviews > 0 ? (avgReputation / numReviews).toFixed(1) : 'N/A';
      avgOpportunity = numReviews > 0 ? (avgOpportunity / numReviews).toFixed(1) : 'N/A';
      avgHappiness = numReviews > 0 ? (avgHappiness / numReviews).toFixed(1) : 'N/A';
      avgInternet = numReviews > 0 ? (avgInternet / numReviews).toFixed(1) : 'N/A';
      avgFacility = numReviews > 0 ? (avgFacility / numReviews).toFixed(1) : 'N/A';
      avgClubs = numReviews > 0 ? (avgClubs / numReviews).toFixed(1) : 'N/A';
      avgSocial = numReviews > 0 ? (avgSocial / numReviews).toFixed(1) : 'N/A';
      avgFood = numReviews > 0 ? (avgFood / numReviews).toFixed(1) : 'N/A';
      avgSafety = numReviews > 0 ? (avgSafety / numReviews).toFixed(1) : 'N/A';
    } else {
      avgLocation = 'N/A';
      avgReputation = 'N/A';
      avgOpportunity = 'N/A';
      avgHappiness = 'N/A';
      avgInternet = 'N/A';
      avgFacility = 'N/A';
      avgClubs = 'N/A';
      avgSocial = 'N/A';
      avgFood = 'N/A';
      avgSafety = 'N/A';
    }
  
    const categoryRatings = {
      Location: avgLocation,
      Reputation: avgReputation,
      Opportunity: avgOpportunity,
      Happiness: avgHappiness,
      Internet: avgInternet,
      Facility: avgFacility,
      Clubs: avgClubs,
      Social: avgSocial,
      Food: avgFood,
      Safety: avgSafety,
    };
  
    for (const key in categoryRatings) {
      const value = categoryRatings[key];
      const li = document.createElement("li");
      li.innerHTML = `<span>${key}:</span> ${value}`;
      ratingsListElement.appendChild(li);
    }
  }
  
  async function fetchUniversityData(name, isLeft) {
    try {
      const response = await fetch(`http://localhost:5000/api/universities/name/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      displayUniversityComparison(data, isLeft); // Pass the entire data object
    } catch (error) {
      console.error('Error fetching university data for comparison:', error);
      alert(`Error fetching data for ${name}. Please try again.`);
    }
  }

// Show suggestions based on search input for the right panel
searchInput.addEventListener("input", async function () {
  const query = this.value.toLowerCase();
  suggestionBox.innerHTML = "";
  if (query === "") {
    suggestionBox.style.display = "none";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/universities/suggestions?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const suggestionsData = await response.json();

    const filteredSuggestions = suggestionsData.filter(name => name !== comparedUniversity1);

    filteredSuggestions.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      li.addEventListener("click", () => selectUniversityToCompare(name));
      suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = filteredSuggestions.length > 0 ? "block" : "none";

  } catch (error) {
    console.error('Error fetching university suggestions:', error);
    suggestionBox.innerHTML = `<li class="error">Error fetching suggestions</li>`;
    suggestionBox.style.display = "block";
  }
});

// Handle Enter key in search input for the right panel
searchInput.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const query = this.value.trim().toLowerCase();
    if (query) {
      try {
        const response = await fetch(`http://localhost:5000/api/universities/suggestions?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const suggestionsData = await response.json();

        const firstMatch = suggestionsData.find(name => name.toLowerCase() === query && name !== comparedUniversity1);

        if (firstMatch) {
          selectUniversityToCompare(firstMatch);
        } else {
          // Optionally handle the case where no exact match is found
          console.log(`No exact match found for "${query}"`);
          // You could display a message to the user here if needed
        }

      } catch (error) {
        console.error('Error fetching university suggestions on Enter:', error);
        // Optionally display an error message to the user
      }
    }
  }
});

// Update right panel with the university selected for comparison
function selectUniversityToCompare(name) {
  console.log('selectUniversityToCompare called with:', name);
  fetchUniversityData(name, false); // Fetch data for the right panel
  searchInput.value = "";
  suggestionBox.style.display = "none";
}
