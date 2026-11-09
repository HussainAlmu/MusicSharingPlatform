document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('#albumSearchForm');
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

    searchForm?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault();
            searchForm.requestSubmit();
        }
    });

});