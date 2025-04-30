const firebaseConfig = {
	apiKey: 'AIzaSyBC9o4M9QJiYCj0OH0WholvMIBMZfEfA-k',
	authDomain: 'idontwanttoinventaname.firebaseapp.com',
	databaseURL: 'https://idontwanttoinventaname-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'idontwanttoinventaname',
	storageBucket: 'idontwanttoinventaname.firebasestorage.app',
	messagingSenderId: '110138784983',
	appId: '1:110138784983:web:3fbfbc311fb4c123fcc492',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const scoresRef = db.ref('highscores');
const counterRef = db.ref('visits');

const hasVisited = localStorage.getItem('visited');

if (!hasVisited) {
	counterRef.transaction(
		current => {
			return (current || 0) + 1;
		},
		(error, committed, snapshot) => {
			if (error) {
				console.error('Błąd podczas aktualizacji licznika:', error);
			} else if (committed) {
				console.log('Licznik zaktualizowany:', snapshot.val());
			} else {
				console.log('Transakcja została przerwana.');
			}
		}
	);

	localStorage.setItem('visited', 'true');
}

// Pobierz wartość licznika tylko raz (oszczędnie)
counterRef
	.get()
	.then(snapshot => {
		if (snapshot.exists()) {
			document.getElementById('visitCounter').textContent = 'Odwiedzin: ' + snapshot.val();
		} else {
			document.getElementById('visitCounter').textContent = 'Odwiedzin: 0';
		}
	})
	.catch(error => {
		console.error('Błąd podczas pobierania licznika:', error);
		document.getElementById('visitCounter').textContent = 'Błąd ładowania licznika';
	});
