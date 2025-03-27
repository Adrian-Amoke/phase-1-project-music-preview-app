const songList = document.getElementById('songList');
const songDetails = document.getElementById('songDetails');
const addSongForm = document.getElementById('addSongForm');

let songs = [];

//Retrieves song data from the server
function fetchSongs() {
    fetch('https://my-app-backend-in2a.onrender.com/api/songs')
        .then(response => response.json())
        .then(data => {
            songs = data; 
            displaySongs();
        })
        .catch(error => console.error('Error fetching songs:', error));
}

//function to render songs
function displaySongs() {
    songList.innerHTML = '';
    //iterates over each song in the songs array
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
        <img src="${song.coverUrl}" alt="${song.title} Cover">
        <span>${song.title} by ${song.artist}</span>
        `;
        
        songItem.dataset.index = index;

        songItem.addEventListener('mouseover', () => {
            songItem.style.backgroundColor = '#0B0C10';
        });
        
        songItem.addEventListener('mouseout', () => {
            songItem.style.backgroundColor = '';
        });
        
        songItem.addEventListener('click', () => {
            showSongDetails(song);
        });
        
        songList.appendChild(songItem);
    });
}

//Function to show song details when song items are clicked
function showSongDetails(song) {
    songDetails.innerHTML = `
    <h2>${song.title}</h2>
    <p>Artist: ${song.artist}</p>
    <p>Album: ${song.album}</p>
    <img src="${song.coverUrl}" alt="${song.title} Cover" class ="cover-image">
    `;
    songDetails.style.display = 'block';
}
//Event listener for form submission
addSongForm.addEventListener('submit', (evt) => {
    evt.preventDefault(); 
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('songArtist').value;
    const album = document.getElementById('songAlbum').value;
    const coverUrl = document.getElementById('coverUrl').value;
    
    const newSong = { title, artist, album, coverUrl };
    
    songs.push(newSong);
    
    displaySongs();
    
    addSongForm.reset();
});

fetchSongs();
