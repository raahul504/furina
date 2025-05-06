// Music Player Script with persistent playback
document.addEventListener('DOMContentLoaded', function() {
    // List of songs - you can add more songs to this list
    let songs = [];

    fetch('/get-music-files')
    .then(res => res.json())
    .then(data => {
        songs = data;
        setupMusicSystem(); // Setup music menu and functionality
    })
    .catch(err => console.error('Error loading music:', err));


    // Use sessionStorage to persist audio state between pages
    let currentSongIndex = sessionStorage.getItem('currentSongIndex') ? parseInt(sessionStorage.getItem('currentSongIndex')) : -1;
    let isPlaying = sessionStorage.getItem('isPlaying') === 'true';
    let currentTime = sessionStorage.getItem('currentTime') ? parseFloat(sessionStorage.getItem('currentTime')) : 0;
    
    // Create audio element
    const audioPlayer = new Audio();

    function setupMusicSystem() {
        // Create nav menu music button
        createMusicNavButton();
        
        // Resume playback if was playing before
        if (isPlaying && currentSongIndex >= 0) {
            audioPlayer.src = songs[currentSongIndex].file;
            audioPlayer.currentTime = currentTime;
            audioPlayer.play().catch(error => {
                console.error("Playback failed:", error);
                isPlaying = false;
                sessionStorage.setItem('isPlaying', 'false');
            });
        }
    }

    function createMusicNavButton() {
        // Find the navbar and the About Us link
        const navbar = document.querySelector('.navbar');
        
        // Remove old music button if it exists (cleanup)
        const oldMusicBtn = navbar.querySelector('.music-btn');
        if (oldMusicBtn) {
            oldMusicBtn.remove();
        }
        
        // Find the About Us link to position our music link before it
        const aboutLink = navbar.querySelector('a[href*="about"]');
        
        if (navbar && aboutLink) {
            // Create the music nav button
            const musicNavBtn = document.createElement('a');
            musicNavBtn.href = '#';
            musicNavBtn.className = 'nav-link nav-music-btn';
            musicNavBtn.textContent = 'Music';
            musicNavBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleMusicDropdown();
            });
            
            // Insert before the About Us link
            navbar.insertBefore(musicNavBtn, aboutLink);
            
            // Create music dropdown container
            const musicDropdown = document.createElement('div');
            musicDropdown.className = 'music-dropdown-panel';
            musicDropdown.id = 'music-dropdown-panel';
            musicDropdown.style.display = 'none';
            
            // Create song list container
            const songListContainer = document.createElement('div');
            songListContainer.id = 'music-list';
            songListContainer.className = 'dropdown-content';
            
            // Append to page
            musicDropdown.appendChild(songListContainer);
            document.body.appendChild(musicDropdown);
            
            // Populate the song list
            populateMusicList(songListContainer);
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.nav-music-btn') && 
                    !e.target.closest('.music-dropdown-panel')) {
                    closeDropdown();
                }
            });
            
            // Update music button styling on night mode change
            updateMusicButtonStyling();
        }
    }
    
    /* Add event listener for night mode changes
    document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.id === 'nightModeToggle') {
            const nightModeBtn = document.getElementById('nightModeToggle');
            if (nightModeBtn) {
                nightModeBtn.addEventListener('click', function() {
                    // Small delay to let the night mode change take effect
                    setTimeout(updateMusicButtonStyling, 50);
                });
            }
        }
    });*/

    function updateMusicButtonStyling() {
        const musicBtn = document.querySelector('.nav-music-btn');
        if (musicBtn) {
            // Reset any inline styles that might override CSS
            musicBtn.style.color = '';
        }
    }
    
    function toggleMusicDropdown() {
        const dropdown = document.getElementById('music-dropdown-panel');
        if (dropdown) {
            if (dropdown.style.display === 'none') {
                // Calculate position
                const musicBtn = document.querySelector('.nav-music-btn');
                const rect = musicBtn.getBoundingClientRect();
                
                dropdown.style.position = 'absolute';
                dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
                dropdown.style.right = (window.innerWidth - rect.right) + 'px';
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        }
    }
    
    function closeDropdown() {
        const dropdown = document.getElementById('music-dropdown-panel');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    function populateMusicList(container) {
        // Clear existing content
        container.innerHTML = '';
        
        // Add songs
        songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            if (index === currentSongIndex && isPlaying) {
                songItem.classList.add('now-playing');
            }
            
            songItem.innerHTML = `
                <span class="song-title">${song.title}</span>
                <button class="play-btn" data-index="${index}">${index === currentSongIndex && isPlaying ? '⏸' : '▶'}</button>
            `;
            container.appendChild(songItem);
            
            // Add click handler directly
            const playBtn = songItem.querySelector('.play-btn');
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleSong(index);
            });
        });
    }

    function toggleSong(index) {
        if (currentSongIndex === index && isPlaying) {
            // If clicking on currently playing song, pause it
            audioPlayer.pause();
            isPlaying = false;
            sessionStorage.setItem('isPlaying', 'false');
        } else {
            // Otherwise play the selected song
            if (currentSongIndex === index) {
                // Resume the same song
                audioPlayer.play();
            } else {
                // Play a new song
                currentSongIndex = index;
                sessionStorage.setItem('currentSongIndex', index);
                audioPlayer.src = songs[currentSongIndex].file;
                audioPlayer.play().catch(error => {
                    console.error("Playback failed:", error);
                    alert(`Sorry, "${songs[index].title}" is not available. The music files need to be added to your project.`);
                    isPlaying = false;
                    sessionStorage.setItem('isPlaying', 'false');
                    return;
                });
            }
            isPlaying = true;
            sessionStorage.setItem('isPlaying', 'true');
        }
        updatePlaybackUI();
    }

    function updatePlaybackUI() {
        // Update song list play buttons
        const playBtns = document.querySelectorAll('.play-btn');
        playBtns.forEach((btn, index) => {
            const songItem = btn.closest('.song-item');
            
            if (index === currentSongIndex) {
                btn.textContent = isPlaying ? '⏸' : '▶';
                songItem.classList.toggle('now-playing', isPlaying);
            } else {
                btn.textContent = '▶';
                songItem.classList.remove('now-playing');
            }
        });
    }

    // When audio ends, play next song
    audioPlayer.addEventListener('ended', function() {
        playNextSong();
    });
    
    // Store current time periodically for resuming playback
    audioPlayer.addEventListener('timeupdate', function() {
        if (isPlaying) {
            sessionStorage.setItem('currentTime', audioPlayer.currentTime);
        }
    });

    function playNextSong() {
        let newIndex = currentSongIndex + 1;
        if (newIndex >= songs.length) newIndex = 0;
        currentSongIndex = newIndex;
        sessionStorage.setItem('currentSongIndex', newIndex);
        audioPlayer.src = songs[currentSongIndex].file;
        audioPlayer.play().catch(error => {
            console.error("Playback failed:", error);
            isPlaying = false;
            sessionStorage.setItem('isPlaying', 'false');
        });
        updatePlaybackUI();
    }

    /* Add global keyboard shortcut to stop audio
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            sessionStorage.setItem('isPlaying', 'false');
            updatePlaybackUI();
        }
    });*/
    
    // Handle page unload
    window.addEventListener('beforeunload', function() {
        if (isPlaying) {
            sessionStorage.setItem('currentTime', audioPlayer.currentTime);
        }
    });
});