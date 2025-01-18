const searchForm = document.querySelector("form");
const inputBox = document.querySelector(".inputBox");
let container = document.querySelector(".container");

const sortSelect = document.querySelector(".sortSelect"); 
const filterSelect = document.querySelector(".filterSelect"); 
const pageContainer = document.querySelector(".pageContainer"); 

let savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
let currentPage = 1;
const itemsPerPage = 8; 

const fetchMovieData = async (movie) => {
  const apiKey = "cc977d2d";
  const API = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movie}`;

  try {
    let res = await fetch(API);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await res.json();
    console.log(data);

    if (data.Response === "False") {
      throw new Error("Movie not available");
    }

    displayMovieData(data);
    saveToLocalStorage(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    container.innerHTML = "<p>Sorry, the movie is not available.</p>";
  }
};

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const movieName = inputBox.value.trim();

  if (movieName === "") {
    alert("Please enter a movie name to search.");
    return;
  }

  fetchMovieData(movieName);
  inputBox.value = "";
});

// Display movie data in the container
function displayMovieData(data) {
  let card = document.createElement("div");
  card.classList.add("movie-card");

  let poster = document.createElement("img");
  poster.setAttribute("src", data.Poster);
  poster.setAttribute("alt", data.Title);

  let title = document.createElement("h1");
  title.innerText = "Title: " + data.Title;

  let country = document.createElement("p");
  country.innerText = "Country: " + data.Country;

  let actors = document.createElement("p");
  actors.innerText = "Actors: " + data.Actors;

  let awards = document.createElement("h3");
  awards.innerText = "Awards: " + data.Awards;

  let director = document.createElement("h2");
  director.innerText = "Director: " + data.Director;

  let plot = document.createElement("h4");
  plot.innerText = "Plot: " + data.Plot;

  let genre = document.createElement("h2");
  genre.innerText = "Genre: " + data.Genre;

  card.append(poster, title, actors, country, awards, director, plot, genre);

  container.appendChild(card);
}

// Save movie data to local storage
function saveToLocalStorage(data) {
  if (!savedMovies.some(movie => movie.Title === data.Title)) {
    savedMovies.push(data);
    localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
  }
  renderMovies();
}

function loadSavedMovies() {
  savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
  renderMovies();
}

function renderMovies() {
  container.innerHTML = ''; 

  // Get the sorted and filtered movies
  let moviesToDisplay = [...savedMovies];

  // Sorting logic
  if (sortSelect.value === 'title') {
    moviesToDisplay.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortSelect.value === 'year') {
    moviesToDisplay.sort((a, b) => a.Year - b.Year);
  }

  if (filterSelect.value !== 'all') {
    moviesToDisplay = moviesToDisplay.filter(movie => movie.Genre.includes(filterSelect.value) || movie.Actors.includes(filterSelect.value));
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = moviesToDisplay.slice(startIndex, startIndex + itemsPerPage);

  paginatedMovies.forEach(movie => displayMovieData(movie));

  renderPagination(moviesToDisplay.length);
}

function renderPagination(totalMovies) {
  const totalPages = Math.ceil(totalMovies / itemsPerPage);
  pageContainer.innerHTML = ''; 

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderMovies();
    });
    pageContainer.appendChild(pageButton);
  }
}

sortSelect.addEventListener("change", renderMovies);
filterSelect.addEventListener("change", renderMovies);

window.addEventListener("load", loadSavedMovies);
