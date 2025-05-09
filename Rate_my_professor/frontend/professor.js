document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const professorName = urlParams.get("name");

  if (!professorName) {
    alert("Professor name missing in URL");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/professors/name/${encodeURIComponent(professorName)}`);
    if (!response.ok) throw new Error("Professor not found");
    const professor = await response.json();

    console.log("Professor data received:", professor);

    professor.rating = parseFloat(professor.rating);
    professor.difficulty = parseFloat(professor.difficulty);
    professor.would_take_again = parseFloat(professor.would_take_again);

    // Populate header
    document.querySelector("h1").textContent = professor.professor_name;
    document.querySelector(".dept-link").textContent = professor.department_name
    document.querySelector(".university-link").textContent = professor.university_name;
    document.querySelector(".rating-stars span").textContent = `${professor.rating.toFixed(1)}/5`;

    // Populate stars
    const starCount = Math.round(professor.rating);
    const starStr = "★★★★★☆☆☆☆☆".slice(5 - starCount, 10 - starCount);
    document.querySelector(".rating-stars .stars").textContent = starStr;

    // Populate summary
    document.querySelector(".summary .stat:nth-child(1) strong").textContent = `${professor.would_take_again || 0}%`;
    document.querySelector(".summary .stat:nth-child(2) strong").textContent = professor.difficulty || 0;

    // Fetch reviews
    const reviewsRes = await fetch(`http://localhost:5000/api/professors/${professor.professor_id}/reviews`);
    const reviews = await reviewsRes.json();

    // Update review count
    document.querySelector(".review-header h4").textContent = `${reviews.length} Reviews`;

    // Update rating distribution
    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 → 1 star, 4 → 5 stars
    reviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (rounded >= 1 && rounded <= 5) ratingCounts[rounded - 1]++;
    });
    const maxCount = Math.max(...ratingCounts, 1); // prevent divide-by-zero

    const colors = ["#d5ab7f", "#b58d63", "#997049", "#7a5233", "#5c3d1c"];
    const labels = ["Bad 1", "Okay 2", "Good 3", "Great 4", "Excellent 5"];

    const distContainer = document.querySelector(".rating-distribution");
    distContainer.innerHTML = "<h4>Rating distribution:</h4>";
    for (let i = 4; i >= 0; i--) {
      const widthPercent = (ratingCounts[i] / maxCount) * 100;
      const barRow = `
        <div class="bar-row">
          <span>${labels[i]}</span>
          <div class="bar" style="width: ${widthPercent}%; background-color: ${colors[i]};"></div>
        </div>
      `;
      distContainer.innerHTML += barRow;
    }

    // Render reviews
    const reviewsContainer = document.querySelector(".reviews");
    reviewsContainer.innerHTML = "";

    reviews.forEach(review => {
      const reviewCard = document.createElement("div");
      reviewCard.classList.add("review-card");
      reviewCard.innerHTML = `
        <div class="rating-box">${review.rating}</div>
        <div class="review-details">
          <strong>${review.course_code || "N/A"}</strong>
          <p>${review.review || "No comment"}</p>
          <p><strong>Quality:</strong> ${review.quality}</p>
          <p><strong>Difficulty:</strong> ${review.difficulty}</p>
          <p><strong>For Credits:</strong> ${review.for_credits ? "yes" : "no"}</p>
          <p><strong>Attendance:</strong> ${review.attendance ? "yes" : "no"}</p>
        </div>
      `;
      reviewsContainer.appendChild(reviewCard);
    });

    const compareLink = document.getElementById("compareLink"); // Get the new anchor tag
        console.log("Compare link element:", compareLink); // Log the compareLink element

        if (compareLink && professor && professor.professor_name) {
            const compareHref = `professor_compare.html?name=${encodeURIComponent(professor.professor_name)}`;
            compareLink.href = compareHref;
            console.log("Compare link href set to:", compareHref); // Log the final href
        } else if (compareLink) {
            compareLink.addEventListener("click", () => {
                alert("Professor name not loaded yet for comparison.");
            });
        }

  } catch (error) {
    alert("Error loading professor data: " + error.message);
  }

});


const modal = document.getElementById("rateModal");
const rateBtn = document.getElementById("rateBtn");
const closeModal = document.getElementById("closeRateModal");
const rateForm = document.getElementById("rateForm");

console.log("Modal element:", modal);

let currentProfessorId = null;

rateBtn.addEventListener("click", () => {
  console.log("Rate button clicked!");
  modal.style.removeProperty("display");
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});


// Submit form handler
rateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(rateForm);
  const reviewData = {
    rating: parseFloat(formData.get("rating")),
    would_take_again: parseFloat(formData.get("would_take_again")),
    difficulty: parseFloat(formData.get("difficulty")),
    quality: parseFloat(formData.get("quality")),
    for_credits: formData.get("for_credits") === "true",
    attendance: formData.get("attendance") === "true",
    course_code: formData.get("course_code"),
    review: formData.get("review"),
  };

  try {
    const res = await fetch(`http://localhost:5000/api/professors/${currentProfessorId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) throw new Error("Failed to submit review");
    alert("Review submitted successfully!");
    modal.style.display = "none";
    rateForm.reset();
    location.reload(); // Reload to show updated reviews and ratings
  } catch (err) {
    alert("Error: " + err.message);
  }

  const testRateBtn = document.getElementById("rateBtn");
  if (testRateBtn) {
    console.log("Rate button found by DOMContentLoaded!");
    testRateBtn.addEventListener("click", () => {
      console.log("Simple rate button click detected!");
      const modalElement = document.getElementById("rateModal");
      if (modalElement) {
        modalElement.style.display = "block";
      } else {
        console.error("Modal element not found!");
      }
    });
  } else {
    console.error("Rate button element not found!");
  }
});
