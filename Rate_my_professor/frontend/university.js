// university.js
function goToCompare() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentUniversityName = urlParams.get('name');
  if (currentUniversityName) {
    window.location.href = `university_compare.html?uni1=${encodeURIComponent(currentUniversityName)}`;
  } else {
    alert('Error: Could not get the current university name for comparison.');
  }
}
  
  window.onload = () => {
    // 1. Get the university name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const universityName = urlParams.get('name'); // Assuming the URL is like university.html?name=MahindraUniversity
  
    if (!universityName) {
      // Handle the case where no university name is provided in the URL
      document.body.innerHTML = '<h1>Error: University name is missing from the URL</h1>';
      return;
    }
  
    // 2. Fetch university data from the backend
    fetch(`http://localhost:5000/api/universities/name/${universityName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          document.body.innerHTML = '<h1>University Not Found</h1>';
          return;
        }
        // 3.  Display the university data
        displayUniversityData(data.university, data.reviews);
      })
      .catch(error => {
        console.error('Error fetching university data:', error);
        document.body.innerHTML = `<h1>Error: Failed to load university data.  ${error}</h1>`; // show error to user
      });
  };
  
  function displayUniversityData(university, reviews) {
    // Update the HTML elements with the fetched data
    document.querySelector('.left-column h2').textContent = university.university_name;
    document.querySelector('.location').textContent = university.location + ' | Hyderabad'; //  Include Hyderabad
    document.querySelector('.overall-score').textContent = university.rating ? university.rating.toFixed(1) : 'N/A'; //check if rating exists
  
    const categoriesDiv = document.querySelectorAll('.categories'); // Select both lists
  
    let overallRating = 'N/A';
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0);
      overallRating = (sum / reviews.length).toFixed(1);
    }
    

    const categoryAverages = {
        Location: { sum: 0, count: 0 },
        Reputation: { sum: 0, count: 0 },
        Opportunity: { sum: 0, count: 0 },
        Happiness: { sum: 0, count: 0 },
        Internet: { sum: 0, count: 0 },
        Facility: { sum: 0, count: 0 },
        Clubs: { sum: 0, count: 0 },
        Social: { sum: 0, count: 0 },
        Food: { sum: 0, count: 0 },
        Safety: { sum: 0, count: 0 },
    };
      
      reviews.forEach(review => {
        if (typeof review.location === 'number') {
          categoryAverages.Location.sum += review.location;
          categoryAverages.Location.count++;
        }
        if (typeof review.reputation === 'number') {
          categoryAverages.Reputation.sum += review.reputation;
          categoryAverages.Reputation.count++;
        }
        if (typeof review.opportunity === 'number') {
          categoryAverages.Opportunity.sum += review.opportunity;
          categoryAverages.Opportunity.count++;
        }
        if (typeof review.happiness === 'number') {
          categoryAverages.Happiness.sum += review.happiness;
          categoryAverages.Happiness.count++;
        }
        if (typeof review.internet === 'number') {
          categoryAverages.Internet.sum += review.internet;
          categoryAverages.Internet.count++;
        }
        if (typeof review.faculty === 'number') {
          categoryAverages.Facility.sum += review.faculty;
          categoryAverages.Facility.count++;
        }
        if (typeof review.clubs === 'number') {
          categoryAverages.Clubs.sum += review.clubs;
          categoryAverages.Clubs.count++;
        }
        if (typeof review.social === 'number') {
          categoryAverages.Social.sum += review.social;
          categoryAverages.Social.count++;
        }
        if (typeof review.food === 'number') {
          categoryAverages.Food.sum += review.food;
          categoryAverages.Food.count++;
        }
        if (typeof review.safety === 'number') {
          categoryAverages.Safety.sum += review.safety;
          categoryAverages.Safety.count++;
        }
      });
      
      const averageCategoryRatings = {};
      for (const category in categoryAverages) {
        const { sum, count } = categoryAverages[category];
        averageCategoryRatings[category] = count > 0 ? (sum / count).toFixed(1) : 'N/A';
      }

      document.querySelector('.overall-score').textContent = overallRating;

    const categoryRatings = {
          Location: averageCategoryRatings.Location,
          Reputation: averageCategoryRatings.Reputation,
          Opportunity: averageCategoryRatings.Opportunity,
          Happiness: averageCategoryRatings.Happiness,
          Internet: averageCategoryRatings.Internet,
          Facility: averageCategoryRatings.Facility,
          Clubs: averageCategoryRatings.Clubs,
          Social: averageCategoryRatings.Social,
          Food: averageCategoryRatings.Food,
          Safety: averageCategoryRatings.Safety,
    };
  
    let categoryHTML1 = '';
    let categoryHTML2 = '';
    let i = 0;
    for (const [category, value] of Object.entries(categoryRatings)) {
      const stars = "★".repeat(value) + "☆".repeat(5 - value);
      const categoryHTML = `<li><strong>${category}:</strong> ${stars}</li>`;
      if (i < 6) {
        categoryHTML1 += categoryHTML;
      }
      else {
        categoryHTML2 += categoryHTML;
      }
      i++;
    }
    categoriesDiv[0].innerHTML = categoryHTML1;
    categoriesDiv[1].innerHTML = categoryHTML2;
  
  
    const reviewsContainer = document.getElementById('reviews-container');
    const ratingCountSpan = document.getElementById('rating-count');
    ratingCountSpan.textContent = reviews.length; // Display the number of reviews
  
    let reviewsHTML = '';
    reviews.forEach(review => {

        console.log("Type of review.rating:", typeof review.rating, "Value:", review.rating);

        const ratingNumber = parseFloat(review.rating); // Convert the string to a number
        const formattedRating = isNaN(ratingNumber) ? 'N/A' : ratingNumber.toFixed(1);
      reviewsHTML += `
        <div class="review-card">
          <div class="rating">${formattedRating}</div>
          <div class="review-text">${review.review_text}</div>
          <div class="date">${review.date}</div>
          <div class="category-stars">
            ${Object.entries({
              Location: review.location,
              Reputation: review.reputation,
              Opportunity: review.opportunity,
              Happiness: review.happiness,
              Internet: review.internet,
              Facility: review.faculty,
              Clubs: review.clubs,
              Social: review.social,
              Food: review.food,
              Safety: review.safety
            }).map(([key, value]) => `
              <div><strong>${key}:</strong> ${"★".repeat(value)}${"☆".repeat(5 - value)}</div>
            `).join('')}
          </div>
          <div class="student-name">By: ${review.student_name}</div>
        </div>
      `;
    });
    reviewsContainer.innerHTML = reviewsHTML;
  }

  function openRateModal() {
  document.getElementById("rate-modal").classList.remove("hidden");
}

function closeRateModal() {
  document.getElementById("rate-modal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const rateButton = document.querySelector(".action-buttons button");
  if (rateButton) {
    rateButton.addEventListener("click", openRateModal);
  }

  document.getElementById("rate-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const universityName = new URLSearchParams(window.location.search).get("name");

    const body = {
      university_name: universityName,
      student_name: document.getElementById("student-name").value,
      review_text: document.getElementById("review-text").value,
      rating: parseFloat(document.getElementById("rating").value),
      location: parseFloat(document.getElementById("location").value),
      reputation: parseFloat(document.getElementById("reputation").value),
      opportunity: parseFloat(document.getElementById("opportunity").value),
      happiness: parseFloat(document.getElementById("happiness").value),
      internet: parseFloat(document.getElementById("internet").value),
      faculty: parseFloat(document.getElementById("faculty").value),
      clubs: parseFloat(document.getElementById("clubs").value),
      social: parseFloat(document.getElementById("social").value),
      food: parseFloat(document.getElementById("food").value),
      safety: parseFloat(document.getElementById("safety").value),
    };

    fetch("http://localhost:5000/api/universities/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Review submitted successfully!");
        closeRateModal();
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error submitting review:", err);
        alert("Failed to submit review.");
      });
  });
});
