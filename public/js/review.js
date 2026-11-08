const form = document.querySelector("#review-form")
const editForm = document.querySelector("#edit-review-form")
const button = document.querySelector("#review-button")
const edit = document.querySelector("#editReviewButton")

if (button && form) {
	button.addEventListener("click", () => {
		form.style.display = "block"
	})
}

if (edit && editForm) {
	edit.addEventListener("click", () => {
		editForm.style.display = "block"
	})
}


document.addEventListener("click", (event) => {
	if (form && button && !form.contains(event.target) && !button.contains(event.target)) {
		form.style.display = "none"
	}
	if (editForm && edit && !editForm.contains(event.target) && !edit.contains(event.target)) {
		editForm.style.display = "none"
	}
})

const reviewToast = new URLSearchParams(window.location.search).get("toast")

if (reviewToast === "updated") {
	Toastify({
		text: "Review updated successfully",
		duration: 3000
	}).showToast()
} else if (reviewToast === "created") {
	Toastify({
		text: "Review added successfully",
		duration: 3000
	}).showToast()
}
