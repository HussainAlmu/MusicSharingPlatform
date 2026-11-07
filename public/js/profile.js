const form = document.querySelector("#profile-form")
const button = document.querySelector("#editProfileButton")
console.log(button)


button.addEventListener("click", () => {
	form.style.display = "block"
    console.log("hi")
})

document.addEventListener("click", (event) => {
	if (!form.contains(event.target) && !button.contains(event.target)) {
		form.style.display = "none"
	}
})
console.log("hi")