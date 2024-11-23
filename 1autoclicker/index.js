let carsDestroyed = 0; // determines the difficulty of the cars
let carsHealthMax = 10; // what the health starts as
let carsHealth = 10; // what the health is
let carType = 1; // car type (for the random images)
let carHue = 0; // car color
let punchValue = 1; // how much health you do when you click the car
let potentialPunchValue = 1;
let upgradePrice = 0; // how much the upgrade costs

function newCar() {
    // pick a car type from 1 to 4
    carType = Math.floor(Math.random() * 7) + 1;
    carHue = Math.floor(Math.random() * 360);
    carFlip = Math.floor(Math.random() * 2);

    // based on cars destroyed, set the carsHealth and carsHealthMax
    carsHealthMax = 10 * (carsDestroyed + 1)^2;
    carsHealth = carsHealthMax;

    // update the car image
    updateCarImage();
}

function updateCarImage() {
    // using carsHealthMax and carsHealth, determine if carsHealth is full (1), half (2), low (3), or empty (4) in quarters
    const carDestoryLevel = 5 - Math.ceil(carsHealth / carsHealthMax * 4);

    const carImage = document.getElementById("car");
    carImage.src = `img/car${carType}_${carDestoryLevel}.png`;

    // update the car color
    carImage.style.filter = `hue-rotate(${carHue}deg)`;

    // remove the previous shake animation if it exists, then add a new one for the shake animation
    carImage.style.animation = '';
    const randomShake = Math.floor(Math.random() * 4) + 1;
    carImage.style.animation = `shake${randomShake} 0.2s`;

    updateText();
}
function updateText() {
    document.getElementById("textStatus").innerText = `car health: ${carsHealth}/${carsHealthMax} (out of ${carsDestroyed} cars destroyed)`;
}
newCar();

document.getElementById("car").addEventListener("click", function() {
    carsHealth -= punchValue;

    if (carsHealth <= 0) {
        carsDestroyed++;
        newCar();
    } else {
        updateCarImage();
    }
});

function updateUpgradeButton() {
    upgradePrice = Math.ceil(1.5 * (punchValue + 1)^1.5);
    potentialPunchValue = Math.ceil(punchValue * 1.5);

    document.getElementById("upgrade").innerText = `REVIVE ${upgradePrice} CARS FOR ${potentialPunchValue} PUNCH DAMAGE INSTEAD OF ${punchValue}`;
}
updateUpgradeButton();

document.getElementById("upgrade").addEventListener("click", function() {
    if (carsDestroyed >= upgradePrice) {
        carsDestroyed -= upgradePrice;
        punchValue = potentialPunchValue;
        updateText();
        updateUpgradeButton();

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
document.getElementById("win").addEventListener("click", function() {
    if (carsDestroyed >= 20) {
        // flash green
        document.getElementById("upgrade").style.backgroundColor = "#00ff00";
        setTimeout(function() {
            document.getElementById("upgrade").style.backgroundColor = "#ffffff";
        }, 100);

        // redirect to /2dvdclicker/index.html
        window.location.href = "/2dvdclicker/index.html";
    } else {
        // flash red
        document.getElementById("upgrade").style.backgroundColor = "#ff0000";
        setTimeout(function() {
            document.getElementById("upgrade").style.backgroundColor = "#ffffff";
        }, 100);
    }
});