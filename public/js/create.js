const options = document.querySelector("#genre");
const buttons = document.querySelector("#genre-tag");

options.addEventListener("change", function () {
    for (const button of buttons.children) {
        if (button.value === options.value) {
            return;
        }
    }
    const button = document.createElement("button");

    button.textContent = options.options[options.selectedIndex].text;
    button.value = options.value;
    button.type = "button";
    button.addEventListener("click", function () {
        button.remove();
    });

    buttons.appendChild(button);
})