const options = document.querySelector("#genre");
const buttons = document.querySelector("#genre-tag");
const csongButton = document.querySelector("#TrackCreate")
const csongContaner = document.querySelector("#Create-Song")
const trackNo = document.querySelector("#track_no")

window.addEventListener("load", function () {
    trackNo.value = "1";
});
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

let nextTrackNumber = 2;

function createSong() {
    const div = document.createElement("div");
    div.classList.add("track");
    div.innerHTML = `<div id="tracklist-container">
                    <div>
                        <label for="track_no">No.</label>
                        <input style="text-align: center;" id="track_no" type="number" name="track_no" >
                    </div>
                    <div>
                        <label for="track_name">Track Name</label>
                        <input id="track_name" type="text" name="track_name" required>
                    </div>
                    <div>
                        <label for="track_duration">Track Duration</label>
                         <input id="track_duration" type="text" name="track_duration" placeholder="MM:SS"
                            inputmode="numeric" pattern="[0-9]+:[0-5][0-9]"
                            title="Enter duration in minutes:seconds (for example, 3:45)" style="text-align: center;"
                            required>
                    </div>
                </div>
                <br>
                <div id="tracklist-tag">
                    <div>
                        <label for="audio-url">Audio URL</label>
                        <div style="display: flex;align-content: center;flex-direction: row;justify-content: center;align-items: center;">
                            <input id="audio-url" type="text" name="audio_url">
                            <button type="button" class="TrackDelete"> <i class="fa fa-trash-o"></i></button>
                        </div>
                    </div>
                </div>
                <br>`;

    csongContaner.appendChild(div)
    div.querySelector('[name="track_no"]').value = nextTrackNumber++;
}

csongButton.addEventListener("click", createSong)


csongContaner.addEventListener("click", (event) => {

    if (event.target.closest(".TrackDelete")) {
        event.target.closest(".track").remove();
    }

});


