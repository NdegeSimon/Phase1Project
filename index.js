let profiles = [];
let currentIndex = 0;

// Fetch profiles
async function fetchProfiles() {
  try {
    const res = await fetch("https://phase1project-1-fe23.onrender.com/profiles");
    profiles = await res.json();
    showProfile(currentIndex);
  } catch (err) {
    console.error("Error fetching profiles:", err);
  }
}

// Fetch on page load
document.addEventListener("DOMContentLoaded", fetchProfiles);

// Show a profile
function showProfile(index) {
  if (profiles.length === 0) return;
  const profile = profiles[index];
  console.log("Image URL:", profile.image);
  // Set profile image, name, tagline, bio, and tags

  document.getElementById("profile-image").src = profile.image;
  document.getElementById("profile-name").innerHTML = `${profile.name} <span class="age">${profile.age} ❤️</span>`;
  document.getElementById("profile-tagline").textContent = profile.tagline;
  document.getElementById("profile-bio").textContent = profile.bio;

  const tagsContainer = document.getElementById("profile-tags");
  tagsContainer.innerHTML = "";
  profile.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag.trim();
    tagsContainer.appendChild(span);
  });
}

// Next button handler
document.getElementById("next-btn").addEventListener("click", () => {
  if (profiles.length === 0) return;
  currentIndex = (currentIndex + 1) % profiles.length;
  showProfile(currentIndex);
});

// Modal open/close logic
document.querySelector(".add-button").addEventListener("click", () => {
  document.getElementById("add-profile-modal").style.display = "block";
});
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("add-profile-modal").style.display = "none";
});
window.addEventListener("click", e => {
  if (e.target.id === "add-profile-modal") {
    document.getElementById("add-profile-modal").style.display = "none";
  }
});

// Add profile form submission
document.getElementById("add-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = +document.getElementById("age").value;
  const tagline = document.getElementById("tagline").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
  const image = document.getElementById("image").value.trim(); // image URL

  const isHttpUrl = image.startsWith("http://") || image.startsWith("https://");
  const isBase64 = image.startsWith("data:image/");

  if (!isHttpUrl && !isBase64) {
    alert("Please enter a valid image URL or base64 image string.");
    return;
  }

  const newProfile = { name, age, tagline, bio, tags, image };

  try {
    await fetch("https://phase1project-1-fe23.onrender.com/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProfile),
    });

    alert("Profile added!");
    document.getElementById("add-profile-form").reset();
    document.getElementById("add-profile-modal").style.display = "none";
    fetchProfiles(); // 
  } catch (err) {
    console.error("Failed to add profile:", err);
    alert("Error adding profile.");
  }
});

