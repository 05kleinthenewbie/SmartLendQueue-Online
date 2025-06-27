document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("userRole");

  if (isLoggedIn && role) {
    showCorrectSection(role);
  }

  // Function to update item availability
  function updateItemAvailability(retryCount = 0, maxRetries = 3) {
    console.log(`Fetching item availability, attempt ${retryCount + 1} of ${maxRetries}`);
    fetch("check_availability.php?all_items=true", { cache: "no-cache" })
      .then(res => {
        console.log("check_availability.php response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Item availability response:", data);
        const allItems = ['Projector', 'Chair', 'Microphones', 'Extension Wire', 'Markers', 'Speakers', 'Amplifiers', 'Cords'];
        document.querySelectorAll(".item-card").forEach(card => {
          const item = card.querySelector(".select-btn").getAttribute("data-item");
          const badge = card.querySelector(".availability-badge");
          const selectBtn = card.querySelector(".select-btn");
          if (allItems.includes(item)) {
            const status = data[item] || 'available'; // Default to available if undefined
            console.log(`Updating ${item}: ${status}`);
            badge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            badge.className = `availability-badge ${status}`;
            selectBtn.disabled = status === 'unavailable';
            if (status === 'unavailable' && selectBtn.classList.contains('selected')) {
              selectBtn.classList.remove('selected');
              document.getElementById('item').value = '';
              console.log(`Deselected ${item} due to unavailability`);
            }
          } else {
            console.warn(`Item ${item} not found in expected list`);
          }
        });
      })
      .catch(error => {
        console.error("Error fetching availability:", error.message);
        if (retryCount < maxRetries) {
          console.log("Retrying availability fetch...");
          setTimeout(() => updateItemAvailability(retryCount + 1, maxRetries), 1000);
        } else {
          console.warn("Max retries reached, setting all items to available as fallback");
          document.querySelectorAll(".item-card").forEach(card => {
            const item = card.querySelector(".select-btn").getAttribute("data-item");
            const badge = card.querySelector(".availability-badge");
            const selectBtn = card.querySelector(".select-btn");
            badge.textContent = "Error";
            badge.className = "availability-badge error";
            selectBtn.disabled = false;
            console.log(`Set ${item} to Error due to fetch failure`);
          });
          document.getElementById("availability-message").textContent = 
            "Failed to load item availability. Please refresh the page.";
        }
      });
  }

  window.loginUser = () => {
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    const passwords = {
      student: "USTP_BALUBAL_STUDENTS",
      faculty: "USTP_BALUBAL_FACULTY",
      admin: "USTP_BALUBAL_ADMIN"
    };

    if (password === passwords[role]) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", role);
      showCorrectSection(role);
    } else {
      alert("Incorrect password.");
    }
  };

  window.logoutUser = () => {
    localStorage.clear();
    location.reload();
  };

  function showCorrectSection(role) {
    document.getElementById("login-section").style.display = "none";
    if (role === "admin") {
      document.getElementById("admin-section").style.display = "block";
      loadBookings();
    } else {
      document.getElementById("borrow-section").style.display = "block";
      updateItemAvailability(); // Load availability for borrow section
    }
  }

  function loadBookings() {
    console.log("Loading bookings...");
    fetch("view_bookings.php")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then(data => {
        document.getElementById("booking-list").innerHTML = data;
        console.log("Bookings loaded successfully");
      })
      .catch(error => {
        console.error("Error loading bookings:", error.message);
        document.getElementById("booking-list").innerHTML = "<p>Error loading bookings. Please try again later.</p>";
      });
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const id = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to remove this booking?")) {
        console.log("Removing booking with ID:", id);
        fetch(`remove_booking.php?id=${id}`, { method: "DELETE" })
          .then(res => {
            if (!res.ok) {
              return res.text().then(errorText => {
                throw new Error(`HTTP error! Status: ${res.status}, Details: ${errorText}`);
              });
            }
            return res.json();
          })
          .then(data => {
            if (data.status === "success") {
              console.log("Booking removed successfully");
              loadBookings();
              updateItemAvailability(); // Refresh availability after removal
            } else {
              console.error("Remove booking failed:", data.message);
              alert("Failed to remove booking: " + (data.message || "Unknown error"));
            }
          })
          .catch(error => {
            console.error("Error removing booking:", error.message);
            alert("Failed to remove booking: " + error.message);
          });
      }
    }
  });

  const selectButtons = document.querySelectorAll(".select-btn");
  selectButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const item = button.getAttribute("data-item");
      const itemInput = document.getElementById("item");
      if (itemInput) {
        itemInput.value = item;
        console.log("Selected item:", item);
      } else {
        console.error("Item input element not found!");
      }
      selectButtons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
    });
  });

  const form = document.getElementById("borrow-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("borrower-name").value;
      const course = document.getElementById("course").value;
      const phone_number = document.getElementById("phone-number").value;
      let item = document.getElementById("item").value;
      const start = document.getElementById("start-time").value;
      const end = document.getElementById("end-time").value;
      const purpose = document.getElementById("purpose").value;
      const role = localStorage.getItem("userRole") || "unknown";

      if (!item) {
        const selectedButton = document.querySelector(".select-btn.selected");
        if (selectedButton) {
          item = selectedButton.getAttribute("data-item");
          document.getElementById("item").value = item;
          console.log("Item fallback from button:", item);
        }
      }

      if (!item) {
        document.getElementById("availability-message").textContent = "Please select an item.";
        console.error("No item selected");
        return;
      }

      console.log("Submitting form with data:", { name, course, phone_number, role, item, start_time: start, end_time: end, purpose });

      fetch(`check_availability.php?start_time=${encodeURIComponent(start)}&end_time=${encodeURIComponent(end)}`)
        .then(res => {
          console.log("check_availability.php response status:", res.status);
          if (!res.ok) {
            return res.text().then(errorText => {
              throw new Error(`HTTP error! Status: ${res.status}, Details: ${errorText}`);
            });
          }
          return res.json();
        })
        .then(unavailableItems => {
          console.log("Availability check response:", unavailableItems);
          if (unavailableItems.includes(item)) {
            document.getElementById("availability-message").textContent = "Item is unavailable at the selected time.";
            console.log("Item unavailable:", item);
          } else {
            fetch("save_booking.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                name,
                course,
                phone_number,
                role,
                item,
                start_time: start,
                end_time: end,
                purpose
              })
            })
              .then(res => {
                console.log("save_booking.php response status:", res.status);
                if (!res.ok) {
                  return res.text().then(errorText => {
                    throw new Error(`HTTP error! Status: ${res.status}, Details: ${errorText}`);
                  });
                }
                return res.text();
              })
              .then(res => {
                console.log("Save booking response:", res);
                const msg = document.getElementById("availability-message");
                if (res === "success") {
                  msg.textContent = "Borrow Successful, You can go to the office and borrow the item";
                  form.reset();
                  selectButtons.forEach(btn => btn.classList.remove("selected"));
                  document.getElementById("item").value = "";
                  console.log("Booking successful");
                  updateItemAvailability(); // Refresh availability after booking
                } else {
                  msg.textContent = "Booking failed: " + res;
                  console.error("Booking failed with response:", res);
                }
              })
              .catch(error => {
                console.error("Error saving booking:", error.message);
                document.getElementById("availability-message").textContent = "Error saving booking: " + error.message;
              });
          }
        })
        .catch(error => {
          console.error("Error checking availability:", error.message);
          document.getElementById("availability-message").textContent = "Error checking availability: " + error.message;
        });
    });
  } else {
    console.error("Borrow form not found!");
  }
});