const form = document.querySelector("#profile-form")
const button = document.querySelector("#editProfileButton")

if (form && button) {
	button.addEventListener("click", () => {
		form.style.display = "block"
	})

	document.addEventListener("click", (event) => {
		if (!form.contains(event.target) && !button.contains(event.target)) {
			form.style.display = "none"
		}
	})
}

if (new URLSearchParams(window.location.search).get("updated") === "true") {
	Toastify({
		text: "Profile updated successfully",
		duration: 3000
	}).showToast()
}