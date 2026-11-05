const form = document.querySelector("#review-form")
const editForm = document.querySelector("#edit-review-form")
const button = document.querySelector("#review-button")
const edit = document.querySelector("#editReviewButton")

button.addEventListener("click", () => {
	form.style.display = "block"
})

edit.addEventListener("click", () => {
	editForm.style.display = "block"
})


document.addEventListener("click", (event) => {
	if (!form.contains(event.target) && !button.contains(event.target)) {
		form.style.display = "none"
	}
})

