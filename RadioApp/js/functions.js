const genreSelect = document.getElementById(`genre-select`);
const radioStations = document.getElementById(`radio-stations`);
const radioPlayer = document.getElementById(`radio-player`);
const volumeSlider = document.getElementById(`volume`);
const searchInput = document.getElementById(`search-input`);
const playPauseIcon = document.getElementById(`play-pause-icon`);
const volumeLabel = document.getElementById(`volume-label`);
const radioImg = document.getElementById(`radio-img`);
const volumeIcon = document.getElementById(`volume-icon`);
const currentStationName = document.getElementById(`current-station`);
const favoritesList = document.getElementById(`favorite-stations`);

const volumeBtn = document.getElementById(`volume-btn`);
const playPauseBtn = document.getElementById(`play-btn`);
const previousBtn = document.getElementById(`previous-btn`);
const nextBtn = document.getElementById(`next-btn`);
const favoritesBtn = document.getElementById(`favorite-btn`);

let currentGenre = 'Rock';
let currentStationIndex = 0;
let currentStations = [];
let isMuted = false;

// funkcija za postavljanje default-ne inicijalizacije
function initialization() {
    addGenreSelectOptions(); // dodeljujemo odmah prikaz Rock stanica
    defaultVolume(); // podesavamo default-ni volume na 3%
    updateCurrentGenre(); // postavljamo defaultno na Rock zanr
    updateFavoriteList(); // prikazujemo favorite stanice iz local
    displayImageSlideShow(); // prikazivanje img slide show-a
}

// funkcija za slide show slika
function displayImageSlideShow(interval = 3000) {
    let currentImageIndex = 0;
    
    function switchImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesSlideShow.length;
        radioImg.src = imagesSlideShow[currentImageIndex];
    }    
    setInterval(switchImage, interval);
}

// funkcija za dinamicko kreiranje opcija za zanrove
function addGenreSelectOptions() {
    Object.keys(stations).forEach(genre => {
        const option = document.createElement(`option`);

        option.textContent = genre;
        option.value = genre;
        
        genreSelect.appendChild(option);
    });
}

// dodeljujemo vrednosti trenutno zanra i trenutnih stanica na osnovu
function updateCurrentGenre() {
    currentGenre = genreSelect.value;
    currentStations = stations[currentGenre];
    currentStationIndex = 0;
    
    updateStationList(currentStations);
}

// funkcija za dinamicko stvaranje button-a
function updateList(container, items, clickHandler) {
    container.innerHTML = ``;

    items.forEach((item, index) => {
        const button = document.createElement(`button`);

        button.textContent = item.name;
        button.className = `btn station-button d-flex justify-content-between align-items-center`;

        button.addEventListener(`click`, () => clickHandler(item, index));

        container.appendChild(button);
    });
}

// funkcija za button click na stanicama
function handleStationClick(index) {
    playStation(station, index);
    updateCurrentStationPlaying(station);
}

// na promenu zanra dinamicki stvaramo dugmice za stanice
function updateStationList(stationsList) {
    updateList(radioStations, stationsList, (station, index) => {
        playStation(station, index);
        updateCurrentStationPlaying(station);
    })
}

// funkcija za dinamicko pravljenje button elemenata favorite stanica
function updateFavoriteList() {
    const favorite = getFavoriteStation();

    updateList(favoritesList, favorite, (station, index) => {
        playStation(station, index);
        updateCurrentStationPlaying(station);
    })
}

// funkcija za get-ovanje favorite stanica
function getFavoriteStation() {
    const favorite = localStorage.getItem(`favoriteStations`);
    return favorite ? JSON.parse(favorite) : [];
}

// funkcija za cuvanje ili brisanje favorite stanice u zavisnosti da li postoji u storage-u
function addOrRemoveFavoriteStation() {
    const favoriteStations = getFavoriteStation();
    const currentStation = currentStations[currentStationIndex];
    const isFavorite = favoriteStations.some(station => station.url === currentStation.url);

    // funkcija za set-ovanje favorite stanica
    function saveFavoriteStation(favorite) {
        localStorage.setItem(`favoriteStations`, JSON.stringify(favorite));
    }
    
    // funkcija za dodavanje omiljene stanice
    function addFavoriteStation(favoriteStation) {
        favoriteStation.push(currentStations[currentStationIndex]);
    
        saveFavoriteStation(favoriteStation);
    
        favoritesBtn.classList.add(`favoriteStations`);
    }
    
    // funkcija za otklanjanje omiljene stanice
    function removeFavoriteStation(favorites, url) {
        const updateFavorites = favorites.filter(station => station.url !== url);
    
        saveFavoriteStation(updateFavorites);
    
        favoritesBtn.classList.remove(`favoriteStations`);
    }

    // funkcija za update-ovanje storage-a na osnovu trenutnog statusa
    function updateFavoriteStatus(favoriteStation, station, isFavorite) {
        if (isFavorite) {
            removeFavoriteStation(favoriteStation, station.url);
        }
        else {
            addFavoriteStation(favoriteStation, station);
        }
    }

    updateFavoriteStatus(favoriteStations, currentStation, isFavorite);
    updateFavoriteList();
}

// funkcija za dodeljivanje play ikonice ako je pause
function playIcon() {
    playPauseIcon.classList.remove(`fa-circle-pause`);
    playPauseIcon.classList.add(`fa-circle-play`);
}

// funkcija za dodeljivanje pause ikonice ako je play
function pauseIcon() {
    playPauseIcon.classList.remove(`fa-circle-play`);
    playPauseIcon.classList.add(`fa-circle-pause`);
}

// funkcija za play trenutne selektovane stranice
function playStation(station, index) {
    currentStationIndex = index;

    radioPlayer.src = station.url;
    radioPlayer.play();

    pauseIcon();
}

// funkcija za play/pause
function playOrPause() {
    if (radioPlayer.paused && radioPlayer.src) {
        radioPlayer.play();
        pauseIcon();
    }
    else {
        radioPlayer.pause();
        playIcon();
    }
}

// funkcija za promenu mute/unmute iconice
function toggleMute() {    
    isMuted = !isMuted;
    
    const volume = isMuted ? 0 : 0.03;

    volumeIcon.classList.toggle(`fa-volume-high`, !isMuted);
    volumeIcon.classList.toggle(`fa-volume-xmark`, isMuted);

    radioPlayer.volume = volume;
    volumeSlider.value = volume;
    volumeLabel.textContent = `${volume * 100}%`;
}

// funkcija za dodelu vrednosti za naziv trenutne stanice koja se pusta
function updateCurrentStationPlaying(station) {
    currentStationName.textContent = station.name;
}

// funkcija za odlazak na prethodnu stanicu
function previousStation() {
    currentStationIndex = (currentStationIndex - 1 + currentStations.length) % currentStations.length;

    playCurrentStation();
}

// funkcija za odlazak na sledecu stanicu
function nextStation() {
    currentStationIndex = (currentStationIndex + 1) % currentStations.length;

    playCurrentStation();
}

// funkcija za obradu promene stanice
function playCurrentStation() {
    playStation(currentStations[currentStationIndex], currentStationIndex);

    pauseIcon();

    updateCurrentStationPlaying(currentStations[currentStationIndex]);
}

// funkcija za default-nu jacinu zvuka
function defaultVolume() {
    const initialVolume = 0.03;

    radioPlayer.volume = initialVolume;
    volumeSlider.value = initialVolume * 100;
    volumeLabel.textContent = `0${volumeSlider.value}%`;
}

// funkcija za podesavanje jacine zvuka na slider-u
function updateVolume() {
    radioPlayer.volume = volumeSlider.value / 100;

    volumeLabel.textContent = radioPlayer.volume < 0.1 ? `0${volumeSlider.value}%` : `${volumeSlider.value}%`;
}

// funkcija za trazenje stanice u zanru
function searchStation() {
    const searchValue = searchInput.value.toLowerCase();

    const filteredStations = currentStations.filter(station => 
        station.name.toLowerCase().includes(searchValue));

    updateStationList(filteredStations);
}