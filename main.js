// Select DOM elements
const movieList = document.querySelector(".movie-list");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
const backBtn = document.querySelector(".back-button");
const videoCollections = document.querySelectorAll(".vid_collection");
const videoCollection1 = document.querySelector(".vid_collection--1");
const videoCollection2 = document.querySelector(".vid_collection--2");
const videoCollection3 = document.querySelector(".vid_collection--3");
const videoCollection4 = document.querySelector(".vid_collection--4");
const videoCollection5 = document.querySelector(".vid_collection--5");
const videoCollection6 = document.querySelector(".vid_collection--6");
const gridContainer = document.querySelector(".grid-container");
const inputSearch = document.querySelector(".search");
const searchList = document.querySelector(".search-lists");
const btnAdd = document.querySelector('.add')
const btnRemove = document.querySelector('.remove')
const API_KEY = "461c53ea7bdbc95cbe992f31719b7a20";
const def = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/original";

// Function to close movie detail view
const closeDetail = function () {
  gridContainer.classList.remove("hidden");
  overlay.classList.add("hidden");
  movieList.classList.add("hidden");
  movieList.style.opacity = 0;
  body.style.background = "var(--bg-background)";
};
// Change mode

// Function to open movie detail view
const openDetail = function (res) {
  gridContainer.classList.add("hidden");
  overlay.classList.remove("hidden");
  movieList.classList.remove("hidden");
  movieList.style.opacity = 1;
  gridContainer.classList.add('hidden')
  document.querySelector(
    ".movie-poster"
  ).src = `${POSTER_URL}${res.poster_path}`;
  document.querySelector(".movie-title").textContent = `${
    res.title || res.name
  }`;
  document.querySelector(".release-date").textContent = `${
    res.release_date || "Unknown"
  }`;
  document.querySelector(".movie-overview").textContent = `${
    res.overview || "No overview available."
  }`;
  document.querySelector(".ratings-info").textContent = `${
    res.vote_count || "No votes yet."
  }`;
  document.querySelector(".genres-info").textContent = `${
    res.media_type || "Unknown type"
  }`;
  body.style.backgroundImage = `url(${POSTER_URL}${res.backdrop_path})`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPositionX = "center";
  body.style.backgroundPositionY = "center";

};

// Function to render search results
const renderSearch = function (results) {
  results.forEach((result) => {
    const html = `
      <li class="s-list" data-detail="${result.id}">${
      result.title || result.name
    }</li>
    `;
    searchList.insertAdjacentHTML("afterbegin", html);
  });
  setupSearchClick(results);

  // Initially hide the search list until user interacts with the search input
  searchList.style.display = "none";
};

// Improved search functionality

const clickSearch = function () {
  [...searchList.querySelectorAll("li")].forEach(function (list) {
    const match = list.textContent.toLowerCase();
    inputSearch.addEventListener("keyup", function (e) {
      e.preventDefault();
      searchList.style.display = "block";

      const text = inputSearch.value.toLowerCase();

      if (match.indexOf(text) != -1) {
        list.classList.remove("hidden");
      } else {
        list.classList.add("hidden");
      }
    });
  });
};

// Reusable function to fetch and render movie collections by genre/category
const fetchMoviesByCategory = async function (url, videoCollection) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results;

    // Clear existing collection
    // videoCollection.innerHTML = '';

    // Insert movies into the collection
    results.forEach((res) => {
      const html = `
        <div class="trending">
          <img src="${POSTER_URL}${res.poster_path}" alt="${
        res.title || res.name
      }" class="trend_img">
        </div>
      `;
      videoCollection.insertAdjacentHTML("afterbegin", html);
    });
    renderSearch(results);

    // Render search results
    // console.log(results);
    clickSearch();

    // Event delegation for detail view
    videoCollection.addEventListener("click", function (e) {
      if (e.target.classList.contains("trend_img")) {
        const clickedItem = results.find(
          (movie) => movie.poster_path === e.target.src.split(POSTER_URL)[1]
        );
        if (clickedItem) {
          openDetail(clickedItem);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Function to load all collections with promise
const loadAllCollections = async function () {
  try {
    await Promise.all([
      fetchMoviesByCategory(
        `${def}/trending/all/week?api_key=${API_KEY}&language=en-US`,
        videoCollection1
      ),
      fetchMoviesByCategory(
        `${def}/discover/movie?api_key=${API_KEY}&with_genres=28`,
        videoCollection2
      ),
      fetchMoviesByCategory(
        `${def}/discover/movie?api_key=${API_KEY}&with_genres=35`,
        videoCollection3
      ),
      fetchMoviesByCategory(
        `${def}/discover/movie?api_key=${API_KEY}&with_genres=27`,
        videoCollection4
      ),
      fetchMoviesByCategory(
        `${def}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
        videoCollection5
      ),
      fetchMoviesByCategory(
        `${def}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
        videoCollection6
      )
    ]);
    console.log("All collections loaded successfully");
  } catch (error) {
    console.error("Error loading collections:", error);
  }
};

// Initialize collections
loadAllCollections();


backBtn.addEventListener("click", closeDetail);

const setupSearchClick = function (data) {
  // Add event listener to search list items
  searchList.addEventListener("click", function (e) {
    if (e.target.classList.contains("s-list")) {
      const movieId = e.target.getAttribute("data-detail");

      // Find the clicked movie in the data array using the movieId
      const selectedMovie = data.find((res) => res.id === Number(movieId));

      // If the movie is found, open the detail view
      if (selectedMovie) {
        openDetail(selectedMovie);
      }
    }
  });
};

// Function to handle hiding search suggestions when clicking outside
const hideSearchOnOutsideClick = function () {
  document.addEventListener("click", function (e) {
    // Check if the click is outside the search input or search list
    const isClickInsideSearch =
      inputSearch.contains(e.target) || searchList.contains(e.target);

    // If the click is outside, hide the search list
    if (!isClickInsideSearch) {
      searchList.style.display = "none";
      inputSearch.value = "";
    }
  });
};

// Call the function to handle outside clicks
hideSearchOnOutsideClick();

btnAdd.addEventListener('click', function(){
  console.log('added to book mark');
})
btnRemove.addEventListener('click', function(){
  console.log('Removed from book mark');
})





