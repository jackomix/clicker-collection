let discCount = 0;
let fedDiscCount = 0;
let discSpawnCount = 1;
let mode = 0;
let upgradePrice = 0;
let potentialDiscSpawnCount = 0;

function spawnDisc() {
    // make the disc element, give it the .disc class, give it the animation, 
    // then change its two movement animations to random values.
    // this gives it a random starting position
    var disc = document.createElement("img");
    disc.classList.add("disc");

    // set the disc's rotation to either CW or CCW by using the appropiate animation
    animationName = Math.random() > 0.5 ? "rotate-cw" : "rotate-ccw";
    disc.style.animation = animationName + " 5s linear infinite, x var(--duration-x) linear infinite alternate, y var(--duration-y) linear infinite alternate";

    randomizeDiscsPosition(disc);
    disc.addEventListener("click", () => {
        if (mode == 0) { discClicked(disc); }
    });
    disc.addEventListener("mouseover", () => {
        if (mode == 1) { discFed(disc); }
    });

    const hue = Math.floor(Math.random() * 360);
    const saturation = 100 + Math.floor(Math.random() * 400);
    disc.style.filter = `hue-rotate(${hue}deg)`;
    disc.style.filter += `saturate(${saturation}%)`;

    // set disc image, which will be disc1 to disc15, like img/disc1.png
    disc.src = "img/disc" + Math.floor(Math.random() * 15 + 1) + ".png";
    document.getElementById("screen").appendChild(disc);

    discCount++;
}
spawnDisc();

function randomizeDiscsPosition(element) {
    element.style.animationDelay = Math.random() * -20 + "s, " + Math.random() * -20 + "s, " + Math.random() * -20 + "s";
}

function discClicked(element) {
    for (let i = 0; i < discSpawnCount; i++) {
        spawnDisc();
    }
    updateText();

    randomizeDiscsPosition(element);
}
function discFed(element) {
    discCount--;
    fedDiscCount++;
    element.remove();
    updateText();

    if (discCount == 0) {
        const screen = document.getElementById("screen");
        // remove all classes first
        screen.classList.remove("beast");
        screen.classList.remove("beastless");
        screen.classList.remove("beastmodeactivate");

        // add the beastless class
        screen.classList.add("beastless");

        // after 3 seconds, remove the beastless class and flash the beastmodeactivate class
        setTimeout(() => {
            screen.classList.remove("beastless");
            screen.classList.add("beastmodeactivate");
            const flashInterval = setInterval(() => {
                screen.classList.add("beastless");
                screen.classList.remove("beastmodeactivate");

                setTimeout(() => {
                    screen.classList.add("beastmodeactivate");
                    screen.classList.remove("beastless");
                }, 50);
            }, 100);

            setTimeout(() => {
                clearInterval(flashInterval);
                screen.classList.remove("beastless");
                screen.classList.add("beastmodeactivate");

                // we make the background black and the buttons black
                document.body.style.backgroundColor = "#000000";
                document.querySelectorAll("button").forEach(button => {
                    button.style.setProperty("background-color", "#000000", "important");
                });

                // make all elements unselectable
                document.querySelectorAll("*").forEach(element => {
                    element.style.userSelect = "none";
                });

                document.body.innerHTML += `
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/9fLLfpjBdcY?autoplay=1&si=s6rABgO44nyylohg&amp;controls=0&amp;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position: fixed; top: 0; left: 0; width: 0%; height: 0%; z-index: -9999; opacity: 0;"></iframe>
                    `;

                toggleFullScreen(document.documentElement);

                // hide the cursor
                document.body.style.setProperty("cursor", "none", "important");
            }, 750);
        }, 1500);
    }
}

function updateText() {
    // update the score text
    document.getElementById("textStatus").innerHTML = "YOU HAVE " + discCount + " DISCS :)<br>YOU HAVE FED " + fedDiscCount + " DISCS TO THE BEAST";
}
updateText();

document.getElementById("modeToggle").addEventListener("click", () => {
    mode = 1 - mode; // toggles between 0 and 1
    updateModeButtonText();
});
function updateModeButtonText() {
    const modeText = ["currently in making discs mode", "currently feeding discs to the beast mode"][mode];
    const modeToggleButton = document.getElementById("modeToggle");
    modeToggleButton.innerHTML = modeText + ", click to toggle";
    modeToggleButton.style.backgroundColor = mode === 1 ? "#ffaaaa" : "#aaaaff";

    if (discCount > 0) {
        const screen = document.getElementById("screen");
        if (mode === 1) {
            screen.classList.add("beast");
            screen.classList.remove("beastless");
        } else {
            screen.classList.add("beastless");
            screen.classList.remove("beast");
        }
    }
}
updateModeButtonText();

function updateUpgradeButtonText() {
    upgradePrice = Math.ceil(15 * (discSpawnCount + 1)^4);
    potentialDiscSpawnCount = Math.ceil(discSpawnCount * 1.5);

    document.getElementById("upgrade").innerText = "SACRIFICE " + upgradePrice + " FED DISCS TO UPGRADE DISC SPAWN FROM " + discSpawnCount + " TO " + potentialDiscSpawnCount;
}
updateUpgradeButtonText();

document.getElementById("upgrade").addEventListener("click", () => {
    if (fedDiscCount >= upgradePrice) {
        fedDiscCount -= upgradePrice;
        discSpawnCount = potentialDiscSpawnCount;
        updateUpgradeButtonText();
        updateText();

        // flash green
        document.getElementById("upgrade").style.backgroundColor = "#00ff00";
        setTimeout(function() {
            document.getElementById("upgrade").style.backgroundColor = "#ffffff";
        }, 100);
    } else {
        // flash red
        document.getElementById("upgrade").style.backgroundColor = "#ff0000";
        setTimeout(function() {
            document.getElementById("upgrade").style.backgroundColor = "#ffffff";
        }, 100);
    }
});

document.getElementById("win").addEventListener("click", () => {
    if (fedDiscCount >= 666) {
        fedDiscCount -= upgradePrice;
        discSpawnCount = potentialDiscSpawnCount;
        updateUpgradeButtonText();
        updateText();

        // flash green
        document.getElementById("win").style.backgroundColor = "#00ff00";
        setTimeout(function() {
            document.getElementById("win").style.backgroundColor = "#ffffff";
        }, 100);

        location.href = "./3evilpotionclicker.html";
    } else {
        // flash red
        document.getElementById("win").style.backgroundColor = "#ff0000";
        setTimeout(function() {
            document.getElementById("win").style.backgroundColor = "#ffffff";
        }, 100);
    }
});

// https://stackoverflow.com/questions/7179535/set-window-to-fullscreen-real-fullscreen-f11-functionality-by-javascript
function toggleFullScreen(elem) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
  