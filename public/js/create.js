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
    button.classList.add("genre-button");
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "genre";
    input.value = options.value;
    button.addEventListener("click", function () {
        button.remove();
        input.remove();
    });

    buttons.appendChild(button);
    buttons.appendChild(input);
})

