// Global variable to store the movie details
let movieDetails;

// Function to update movie details on the page
function updateMovieDetails(movie) {
  document.getElementById('poster').src = movie.poster;
  document.getElementById('title').innerText = `Title: ${movie.title}`;
  document.getElementById('runtime').innerText = `Runtime: ${movie.runtime} minutes`;
  document.getElementById('showtime').innerText = `Showtime: ${movie.showtime}`;
  const availableTickets = movie.capacity - movie.tickets_sold;
  document.getElementById('availableTickets').innerText = `Available Tickets: ${availableTickets}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Fetch the movie details for the first film and store it in the global variable
  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(film => {
      movieDetails = film;
      updateMovieDetails(movieDetails);
    });

  // Fetch the film menu
  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(films => {
      const filmsList = document.getElementById('films');
      filmsList.innerHTML = '';  // Clear any existing content

      films.forEach((film) => {
        const filmItem = document.createElement('li');
        filmItem.innerText = film.title;
        filmItem.classList.add('film', 'item');
        filmItem.style.position = 'relative';
      
        // Add a delete button for each film
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
          fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'DELETE',
          });
      
          // Remove the film item from the menu
          filmItem.remove();
        });
      
        deleteButton.style.position = 'absolute';
        deleteButton.style.bottom = '0';
        deleteButton.style.right = '0';
      
        filmItem.appendChild(deleteButton);
      
        if (film.tickets_sold >= film.capacity) {
          filmItem.classList.add('sold-out');
        }
      
        filmItem.addEventListener('click', () => {
          // Update the movie details on the page
          updateMovieDetails(film);
        });
      
        filmsList.appendChild(filmItem);
      });
      
    });

  const buyTicketButton = document.getElementById('buyTicket');
  buyTicketButton.addEventListener('click', () => {
    const availableTicketsElement = document.getElementById('availableTickets');
    let availableTickets = parseInt(availableTicketsElement.innerText.split(' ')[2]);

    if (availableTickets > 0) {
      availableTicketsElement.innerText = `Available Tickets: ${availableTickets - 1}`;
    } else {
      alert('Tickets are sold out for this showtime!');
      const buyTicketButton = document.getElementById('buyTicket');
      buyTicketButton.innerText = 'Sold Out';
      return;  // No need to proceed if tickets are sold out
    }

    // Update tickets_sold on the server
    const movieId = " ";/* Replace with the appropriate movie ID */;
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tickets_sold: availableTickets - 1
      })
    });
  });
});
