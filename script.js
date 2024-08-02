const apiKey = '<YOUTUBE-KEY HIER>'; // Dein API-Schlüssel

// Funktion zum Kürzen von Titeln
function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength) + '...';
    }
    return title;
}

// Funktion zur Ausführung der Videosuche
async function searchVideos() {
    const query = document.getElementById('searchQuery').value;
    if (!query) {
        alert('Bitte gib einen Suchbegriff ein.');
        return;
    }

    console.log(`Suche nach: ${query}`);
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        const data = await response.json();
        console.log('Antwortdaten:', data);

        const videosContainer = document.getElementById('videos');
        videosContainer.innerHTML = '';

        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const videoDiv = document.createElement('div');
                videoDiv.className = 'video';
                const truncatedTitle = truncateTitle(item.snippet.title, 20); // Kürze den Titel
                videoDiv.innerHTML = `
                    <img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title}">
                    <p>${truncatedTitle}</p>
                `;
                videoDiv.onclick = () => {
                    loadVideo(item.id.videoId);
                    // Suchergebnisse nach Auswahl eines Videos löschen
                    videosContainer.innerHTML = '';
                };
                videosContainer.appendChild(videoDiv);
            });
        } else {
            videosContainer.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
        }
    } catch (error) {
        console.error('Fehler bei der API-Anfrage:', error);
        document.getElementById('videos').innerHTML = '<p>Fehler bei der Suche. Bitte versuche es später erneut.</p>';
    }
}

// Funktion zum Laden eines Videos
function loadVideo(videoId) {
    const player = document.getElementById('player');
    player.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

// Event-Listener für die Enter-Taste in der Suchleiste
document.addEventListener('DOMContentLoaded', () => {
    const searchField = document.getElementById('searchQuery');
    searchField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { // Prüfen, ob die Enter-Taste gedrückt wurde
            e.preventDefault(); // Verhindert das Standard-Formularverhalten (falls es ein Formular ist)
            searchVideos(); // Suche ausführen
        }
    });

    // Event-Listener für den Klick auf den Link "Nutzungsbedingungen"
    document.getElementById('termsLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('termsPopup').style.display = 'flex';
    });
});

// Funktion zum Schließen des Popups
function closePopup() {
    document.getElementById('termsPopup').style.display = 'none';
}

// Dynamisches Header-Verhalten
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const logo = document.getElementById('logo');
    const title = document.getElementById('title');

    if (window.scrollY > 50) { // Schwellenwert für das Scrollen
        header.style.padding = '10px 20px';
        header.style.backgroundColor = '#1e1e1e';
        logo.style.width = '50px'; // Größe des Logos verkleinern
        logo.style.borderRadius = '20%'; // Abrunden des Logos
        title.style.fontSize = '1.5rem'; // Schriftgröße des Titels verkleinern
        title.style.position = 'absolute';
        title.style.left = '50%'; // Zentrieren des Titels
        title.style.transform = 'translateX(-50%)'; // Horizontal zentrieren
        header.style.height = '70px'; // Höhe des Headers anpassen
    } else {
        header.style.padding = '20px';
        header.style.backgroundColor = '#1e1e1e';
        logo.style.width = '80px'; // Standardgröße des Logos
        logo.style.borderRadius = '20%'; // Abrunden des Logos
        title.style.fontSize = '2rem'; // Standardgröße des Titels
        title.style.position = 'static';
        title.style.left = 'auto';
        title.style.transform = 'none';
        header.style.height = '100px'; // Standardhöhe des Headers
    }
});
