tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                secondary: '#EC4899',
                accent: '#8B5CF6',
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'spin-slow': 'spin 8s linear infinite',
            }
        }
    }
}


const button = document.getElementById('myButton');
const lamp = document.getElementById('Lamp');
const tv = document.getElementById('Tv');
const cat = document.getElementById('Cat');
const clickCounterDisplay = document.getElementById('clickCounter');
const clickSound = new Audio('/Click.mp3');

let clickCount = 0;
let clickTimer = null;
const clickDelay = 1000;
let lampState = false;
let tvState = false;
let catState = false;

button.addEventListener('click', () => {
	clickCount++;
	clickCounterDisplay.textContent = clickCount;
    clickSound.currentTime = 0; 
    clickSound.play();
    
	if (clickTimer) {
		clearTimeout(clickTimer);
	}

	clickTimer = setTimeout(() => {
		if (clickCount === 1) {
			toggleLamp();
			addPulseEffect(lamp);
		} else if (clickCount === 2) {
			toggleTv();
			addPulseEffect(tv);
		} else if (clickCount >= 3) {
			toggleCat();
			addPulseEffect(cat);
		}

		clickCount = 0;
		clickCounterDisplay.textContent = clickCount;
	}, clickDelay);
});

function toggleLamp() {
	if (lampState) {
		lamp.src = 'LampOFF.svg';
		lampState = false;
	} else {
		lamp.src = 'LampON.svg';
		lampState = true;
	}
}

function toggleTv() {
	if (tvState) {
		tv.src = 'TVOFF.svg';
		tvState = false;
	} else {
		tv.src = 'TVON.svg';
		tvState = true;
	}
}

function toggleCat() {
	if (catState) {
		cat.src = 'Cat.svg';
		catState = false;
	} else {
		cat.src = 'CatON.gif';
		catState = true;
	}
}

function addPulseEffect(element) {
	element.style.transition = 'transform 0.3s ease';
	element.style.transform = 'scale(1.1)';

	setTimeout(() => {
		element.style.transform = 'scale(1)';
	}, 300);
}
