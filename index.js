// Selects elements in the html
const songList = document.getElementById('songList');
const songDetails = document.getElementById('songDetails');
const addSongForm = document.getElementById('addSongForm');

//initializes an empty array to store the song data
let songs = [];

//Retrieves song data from the server
function fetch() {
    fetch('https://my-json-server.typicode.com/Adrian-Amoke/phase-1-project-music-preview-app')// makes a get request to the url
        .then(response => response.json()) // processes the response and and converts it from json to js
        .then(data => {
            songs = data; //assigns the fethced data to the songs array
            displaySongs();// calls the render function to update the song list displayed on the page
        })
        .catch(error => console.error('Error fetching songs:', error));//handles errors that occur during fetching
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
        //This adds a custom data attribute to the div to store the index of the song
        songItem.dataset.index = index;

        //event that changes color when song item is hovered over
        songItem.addEventListener('mouseover', () => {
            songItem.style.backgroundColor = '#F1D3B2';
        });
        //resets the background color of the song item 
        songItem.addEventListener('mouseout', () => {
            songItem.style.backgroundColor = '';
        });
        //click event that calls the showSongDetails function
        songItem.addEventListener('click', () => {
            showSongDetails(song);
        });
        //This appends the newly created div to the songList element, making it visible on the page
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
    evt.preventDefault(); //prevents the page from refreshing after submission
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('songArtist').value;
    const album = document.getElementById('songAlbum').value;
    const coverUrl = document.getElementById('coverUrl').value;
    //Create a new song object using the enteres values
    const newSong = { title, artist, album, coverUrl };
    //add new song to the songs array
    songs.push(newSong);
    //updates the displayed song list with the newly added song
    displaySongs();
    //resets the form fields to their initial empty state after submission
    addSongForm.reset();
});

//initial fetch of songs
fetchSongs();
