document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('#searchBar');
    const albumCards = document.querySelectorAll('.album-card');
    const next = document.querySelector("#next")
    const previous = document.querySelector("#previous")

    function changeAlbumPage(offset) {
        const url = new URL(window.location.href);
        const page = Number(url.searchParams.get('page')) || 1;
        url.searchParams.set('page', Math.max(1, page + offset));
        window.location.href = url;
    }

    next.addEventListener("click", () => changeAlbumPage(1))
    previous.addEventListener("click", () => changeAlbumPage(-1))

    if (!searchBar) return;

    searchBar.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();

        albumCards.forEach((card) => {
            const albumName = card.querySelector('.album-name')?.textContent ?? '';
            const artistName = card.querySelector('.album-artist')?.textContent ?? '';
            const matches = `${albumName} ${artistName}`.toLowerCase().includes(query);

            card.style.display = matches ? '' : 'none';
        });
    });
});