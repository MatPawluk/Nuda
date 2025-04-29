const Rotating = document.getElementById("Rotating");
const rotationSlider = document.getElementById("rotationSlider");

rotationSlider.addEventListener("input", () => {
    const speed = 11 - rotationSlider.value;

    if (rotationSlider.value > 0) {
        Rotating.classList.add("spin");
        Rotating.style.animationDuration = `${speed}s`;
    } else {
        Rotating.classList.remove("spin");
        Rotating.style.animationDuration = null;
    }
});
