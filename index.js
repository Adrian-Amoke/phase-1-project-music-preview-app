const songList = document.getElementById('songList');
const songDetails = document.getElementById('songDetails');
const addSongForm = document.getElementById('addSongForm');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const searchButton = document.getElementById('searchButton');
const favouritesButton = document.getElementById('favouritesButton');

let songs = [];
let favourites = [];
let showingFavourites = false;

// Fetch songs from the backend
function fetchSongs() {
    fetch('https://my-app-backend-in2a.onrender.com/api/songs')
        .then(response => response.json())
        .then(data => {
            songs = data;
            displaySongs(songs);
        })
        .catch(error => console.error('Error fetching songs:', error));
}

// Fetch favourites from backend and ensure full song data
function loadFavourites() {
    fetch('https://my-app-backend-in2a.onrender.com/api/favourites')
        .then(response => response.json())
        .then(data => {
            favourites = data.map(fav => {
                // Ensure each favourite has complete data
                const fullSong = songs.find(song => song.title === fav.title);
                return fullSong ? fullSong : fav;
            });
        })
        .catch(error => console.error('Error loading favourites:', error));
}

// Save favourites to backend
function saveFavourites() {
    fetch('https://my-app-backend-in2a.onrender.com/api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favourites),
    }).catch(error => console.error('Error saving favourites:', error));
}

// Display songs (or favourites if toggled)
function displaySongs(songArray) {
    songList.innerHTML = '';
    songArray.forEach((song) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <img src="${song.coverUrl}" alt="${song.title} Cover">
            <span>${song.title} by ${song.artist}</span>
            <button class="fav-btn">${showingFavourites ? 'Remove' : 'Favourite'}</button>
        `;

        songItem.addEventListener('click', () => showSongDetails(song));

        const favButton = songItem.querySelector('.fav-btn');
        favButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click event from triggering song details
            if (showingFavourites) {
                removeFromFavourites(song);
            } else {
                addToFavourites(song);
            }
        });

        songList.appendChild(songItem);
    });
}

// Show song details when clicked
function showSongDetails(song) {
    songDetails.innerHTML = `
        <h2>${song.title}</h2>
        <p>Artist: ${song.artist}</p>
        <p>Album: ${song.album}</p>
        <img src="${song.coverUrl}" alt="${song.title} Cover" class="cover-image">
    `;
    songDetails.style.display = 'block';
}

// Add song to favourites
function addToFavourites(song) {
    if (!favourites.some(fav => fav.title === song.title)) {
        favourites.push({ ...song });
        saveFavourites();
    }
}

// Remove song from favourites
function removeFromFavourites(song) {
    favourites = favourites.filter(fav => fav.title !== song.title);
    saveFavourites();
    displaySongs(favourites);
}

// Search and filter songs
searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const filter = filterType.value;
    
    const filteredSongs = songs.filter(song => {
        if (filter === 'title') return song.title.toLowerCase().includes(query);
        if (filter === 'artist') return song.artist.toLowerCase().includes(query);
        if (filter === 'album') return song.album.toLowerCase().includes(query);
        return false;
    });

    displaySongs(filteredSongs);
});

// Show favourites when button is clicked
favouritesButton.addEventListener('click', () => {
    showingFavourites = !showingFavourites;
    favouritesButton.textContent = showingFavourites ? 'All Songs' : 'Favourites';
    displaySongs(showingFavourites ? favourites : songs);
});

// Handle form submission to add a new song
addSongForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('songArtist').value;
    const album = document.getElementById('songAlbum').value;
    const coverUrl = document.getElementById('coverUrl').value;

    const newSong = { title, artist, album, coverUrl };

    // Save new song to backend
    fetch('https://my-app-backend-in2a.onrender.com/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSong),
    })
    .then(response => response.json())
    .then(savedSong => {
        songs.push(savedSong);
        if (!showingFavourites) displaySongs(songs);
    })
    .catch(error => console.error('Error adding song:', error));

    addSongForm.reset();
});

// Load songs and favourites on page load
fetchSongs().then(loadFavourites);
