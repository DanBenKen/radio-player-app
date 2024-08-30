document.addEventListener(`DOMContentLoaded`, () => {
    // inicijalizacija vrednosti
    initialization();

    // selektovanje zanra
    genreSelect.addEventListener(`change`, updateCurrentGenre);

    // input event za naziv stanice u search bar-u
    searchInput.addEventListener(`input`, searchStation);
    
    // button za prethodnu stanicu
    previousBtn.addEventListener(`click`, previousStation);
    
    // button za sldecu stranicu
    nextBtn.addEventListener(`click`, nextStation);
    
    // button za play || pause
    playPauseBtn.addEventListener(`click`, playOrPause);
    
    // button za dodavanje i otklanjanje favorite stanice
    favoritesBtn.addEventListener(`click`, addOrRemoveFavoriteStation);
    
    // mute/unmute
    volumeIcon.addEventListener(`click`, toggleMute);

    // slider za volume
    volumeSlider.addEventListener(`input`, updateVolume);
});