document.addEventListener('DOMContentLoaded', () => {
	const searchBar = document.querySelector('#searchBar');
	const albumCards = document.querySelectorAll('.album-card');

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