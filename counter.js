 const firebaseConfig = {
    apiKey: "AIzaSyBC9o4M9QJiYCj0OH0WholvMIBMZfEfA-k",
    authDomain: "idontwanttoinventaname.firebaseapp.com",
    databaseURL: "https://idontwanttoinventaname-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "idontwanttoinventaname",
    storageBucket: "idontwanttoinventaname.firebasestorage.app",
    messagingSenderId: "110138784983",
    appId: "1:110138784983:web:3fbfbc311fb4c123fcc492"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const counterRef = db.ref('visits');
  
  const hasVisited = localStorage.getItem('visited');
  
  if (!hasVisited) {
    counterRef.transaction(current => {
      return (current || 0) + 1;
    });
  
    localStorage.setItem('visited', 'true');
  }
  
  counterRef.on('value', snapshot => {
    document.getElementById('visitCounter').textContent = 'Odwiedzin: ' + snapshot.val();
  });
  