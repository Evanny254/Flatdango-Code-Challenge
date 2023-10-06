document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch movie details by ID
    const fetchMovieDetails = async (movieId) => {
      try {
        const response = await fetch(`http://localhost:3000/films/${movieId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const movieData = await response.json();
        return movieData;
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
  
    // Function to update movie details on the page
    const updateMovieDetails = (movie) => {
      document.getElementById('poster').src = movie.poster;
      document.getElementById('title').innerText = `Title: ${movie.title}`;
      document.getElementById('runtime').innerText = `Runtime: ${movie.runtime} minutes`;
      document.getElementById('showtime').innerText = `Showtime: ${movie.showtime}`;
      const availableTickets = movie.capacity - movie.tickets_sold;
      document.getElementById('availableTickets').innerText = `Available Tickets: ${availableTickets}`;
    };
  
    // Function to handle buying a ticket
    const buyTicket = async () => {
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
      const movieId = " "/* Replace with the appropriate movie ID */;
      try {
        const response = await fetch(`http://localhost:3000/films/${movieId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tickets_sold: availableTickets - 1
          })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error updating tickets_sold:', error);
      }
    };
  
    // Function to fetch film menu and populate the films
    const fetchFilmMenu = async () => {
      try {
        const response = await fetch('http://localhost:3000/films');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const films = await response.json();
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = '';  // Clear any existing content
  
        films.forEach((film) => {
          const filmItem = document.createElement('li');
          filmItem.innerText = film.title;
          filmItem.classList.add('film', 'item');
  
          // Add a delete button for each film
          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Delete';
          deleteButton.addEventListener('click', async () => {
            try {
              const response = await fetch(`http://localhost:3000/films/${film.id}`, {
                method: 'DELETE'
              });
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              // Remove the film item from the menu
              filmItem.remove();
            } catch (error) {
              console.error('Error deleting film:', error);
            }
          });
  
          filmItem.appendChild(deleteButton);
  
          if (film.tickets_sold >= film.capacity) {
            filmItem.classList.add('sold-out');
          }
          filmItem.addEventListener('click', () => {
            fetchMovieDetails(film.id)
              .then((movie) => updateMovieDetails(movie))
              .catch((error) => console.error('Error fetching movie details:', error));
          });
          filmsList.appendChild(filmItem);
        });
      } catch (error) {
        console.error('Error fetching film menu:', error);
      }
    };
  
    // Initialize the page
    window.onload = () => {
      fetchFilmMenu();
      fetchMovieDetails(1)
        .then((movie) => updateMovieDetails(movie))
        .catch((error) => console.error('Error fetching movie details:', error));
  
      const buyTicketButton = document.getElementById('buyTicket');
      buyTicketButton.addEventListener('click', buyTicket);
    };
  });
  