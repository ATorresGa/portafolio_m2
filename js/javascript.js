const games = [
	{ id: 1, imagen: "assets/images/Captura-de-pantalla-2022-06-09-a-las-20.51.04.png", nombre: "Last of us Part I", precio: "$49.99" },
	{ id: 2, imagen: "assets/images/imagen_2024-02-19_095954497.png", nombre: "Tekken 2 - Launch edition", precio: "$59.99" },
	{ id: 3, imagen: "assets/images/horizon.png", nombre: "Horizon Forbidden West", precio: "$69.99" },
	{ id: 4, imagen: "assets/images/Ratchet3-min-819x1024.png", nombre: "Ratchet and Clank: Rift Apart", precio: "$59.99" },
	{ id: 5, imagen: "assets/images/Spidey2-min-819x1024.png", nombre: "Spider-Man 2", precio: "$69.99" },
	{ id: 6, imagen: "assets/images/WWE-2K22-ps5.png", nombre: "WWE 2K22", precio: "$49.99" }
];

window.games = games;
let cart = [];

function saveCart() {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
	const stored = localStorage.getItem('cart');
	if (stored) {
		try {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed)) {
				cart = parsed;
			}
		} catch (error) {
			console.warn('No se pudo cargar el carrito desde localStorage:', error);
		}
	}
}

// Función para generar el HTML de una tarjeta de juego
function _gameColHtml(game) {
	return `
		<div class="col-sm-4 mb-3 mb-sm-0">
			<div class="card" style="width: 18rem;">
				<img src="${game.imagen}" class="card-img-top" alt="${game.nombre}">
				<div class="card-body">
					<input type="hidden" class="game-id" value="${game.id}">
					<h5 class="card-title">${game.nombre}</h5>
					<p class="card-text">${game.precio}</p>
					<a href="#" class="btn btn-primary">Agregar al carrito</a>
				</div>
			</div>
		</div>`;
}

function renderGamesGrid(containerId, gamesArray, perRow = 3, limit = null) {
	const container = document.getElementById(containerId);
	if (!container) return;
	const items = limit ? gamesArray.slice(0, limit) : gamesArray.slice();

    // Si el contenedor ya es una fila, renderizamos solo las columnas dentro de esa fila
	if (container.classList.contains('row')) {
		const cols = items.slice(0, perRow).map(_gameColHtml).join('');
		container.innerHTML = cols;
		return;
	}

	const rows = [];
	for (let i = 0; i < items.length; i += perRow) {
		const slice = items.slice(i, i + perRow).map(_gameColHtml).join('');
		rows.push(`<div class="row">${slice}</div>`);
	}
	container.innerHTML = rows.join('');
}

document.addEventListener('DOMContentLoaded', () => {
	loadCart();
	// Index: renderiza solo si los 3 primeros existen en la fila 
	renderGamesGrid('games-row', window.games, 3, 3);
	// Buscador: reenderiza todos los juegos dentro de un grid de filas con 3 columnas cada una (si el contenedor existe)
	renderGamesGrid('buscador-grid', window.games, 3, null);
	// Carrito: renderiza el contenido persisted si la página lo incluye
	renderCart();
});

// Función para agregar un juego al carrito
function addToCart(gameId) {
	const game = window.games.find(g => g.id === gameId);
	if (game) {
		cart.push(game);
		saveCart();
		console.log(`Agregado al carrito: ${game.nombre}`);
	}
}

// Delegación de eventos para manejar clicks en los botones "Agregar al carrito"
document.addEventListener('click', (event) => {
	if (event.target.matches('.btn-primary')) {
		event.preventDefault();
		const gameId = parseInt(event.target.closest('.card-body').querySelector('.game-id').value);
		addToCart(gameId);
	}
});

// Función para renderizar el contenido del carrito
function renderCart() {
	const cartContainer = document.getElementById('cart-items');
	if (!cartContainer) return;
	if (cart.length === 0) {
		cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
		return;
	}
	const cartItemsHtml = cart.map(game => `
		<div class="col-sm-4 mb-3 mb-sm-0">
			<div class="card" style="width: 18rem;">
				<img src="${game.imagen}" class="card-img-top" alt="${game.nombre}">
				<div class="card-body">
					<h5 class="card-title">${game.nombre}</h5>
					<p class="card-text">${game.precio}</p>
				</div>
			</div>
		</div>
	`).join('');
	cartContainer.innerHTML = `<div class="row">${cartItemsHtml}</div>`;
}
