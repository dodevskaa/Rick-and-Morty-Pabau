let currentPage = 1;
let loading = false;
let allCharacters = [];

let statusFilter = "";
let speciesFilter = "";
let sortOption = "";

let currentLanguage = "en";

const charactersList = document.getElementById("characters-list");
const loadingIndicator = document.getElementById("loading");
const errorContainer = document.getElementById("error");

async function fetchCharacters(page = 1) {
  loadingIndicator.textContent = "Loading...";
  errorContainer.textContent = "";
  
  const query = `
    {
      characters(page: ${page}) {
        results {
          id
          name
          status
          species
          gender
          origin {
            name
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch("https://rickandmortyapi.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data.data.characters.results;
  } catch (error) {
    console.error("Error fetching characters:", error);
    errorContainer.textContent = "Error fetching data!";
    return [];
  } finally {
    loadingIndicator.textContent = "";
  }
}

function displayCharacters(characters) {
  charactersList.innerHTML = "";
  characters.forEach(character => {
    const col = document.createElement("div");
    col.className = "col"; 

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-center">${character.name}</h5>
          <p class="card-text">
            <strong>Status:</strong> ${formatStatus(character.status)}<br>
            <strong>Species:</strong> ${character.species}<br>
            <strong>Gender:</strong> ${character.gender}<br>
            <strong>Origin:</strong> ${character.origin.name}
          </p>
        </div>
      </div>
    `;

    charactersList.appendChild(col);
  });
}

function formatStatus(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function applyFiltersAndSort() {
  let filtered = [...allCharacters];
  
  if (statusFilter) {
    filtered = filtered.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
  }
  if (speciesFilter) {
    filtered = filtered.filter(c => c.species.toLowerCase() === speciesFilter.toLowerCase());
  }
  
  if (sortOption === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "origin") {
    filtered.sort((a, b) => a.origin.name.localeCompare(b.origin.name));
  }
  
  displayCharacters(filtered);
}

document.getElementById("status-filter").addEventListener("change", (e) => {
  statusFilter = e.target.value;
  applyFiltersAndSort();
});

document.getElementById("species-filter").addEventListener("change", (e) => {
  speciesFilter = e.target.value;
  applyFiltersAndSort();
});

document.getElementById("sort-filter").addEventListener("change", (e) => {
  sortOption = e.target.value;
  applyFiltersAndSort();
});


async function loadMoreCharacters() {
  if (loading) return;
  loading = true;
  const newCharacters = await fetchCharacters(currentPage);
  allCharacters = allCharacters.concat(newCharacters);
  applyFiltersAndSort();
  currentPage++;
  loading = false;
}

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreCharacters();
  }
});

document.getElementById("language-toggle").addEventListener("click", () => {
    if (currentLanguage === "en") {
        currentLanguage = "de"; 
        document.getElementById("language-toggle").textContent = "Switch to English";
        
        document.querySelector("h1").textContent = "Rick und Morty Charaktere";
        document.querySelector("#status-filter option:nth-child(1)").textContent = "Nach Status filtern";
        document.querySelector("#status-filter option:nth-child(2)").textContent = "Lebendig";
        document.querySelector("#status-filter option:nth-child(3)").textContent = "Tot";
        document.querySelector("#status-filter option:nth-child(4)").textContent = "Unbekannt";
        document.querySelector("#species-filter option:nth-child(1)").textContent = "Nach spezies filtern";
        document.querySelector("#species-filter option:nth-child(2)").textContent = "Mensch";
        document.querySelector("#species-filter option:nth-child(3)").textContent = "Außerirdisch";
        document.querySelector("#sort-filter option:nth-child(1)").textContent = "Sortieren nach";
        document.querySelector("#sort-filter option:nth-child(2)").textContent = "Name";
        document.querySelector("#sort-filter option:nth-child(3)").textContent = "Herkunft";
        
    } else {
        currentLanguage = "en"; 
        document.getElementById("language-toggle").textContent = "Wechsel zu Deutsch";
        
        document.querySelector("h1").textContent = "Rick and Morty Characters";
        document.querySelector("#status-filter option:nth-child(1)").textContent = "Filter by Status";
        document.querySelector("#status-filter option:nth-child(2)").textContent = "Alive";
        document.querySelector("#status-filter option:nth-child(3)").textContent = "Dead";
        document.querySelector("#status-filter option:nth-child(4)").textContent = "Unknown";
        document.querySelector("#species-filter option:nth-child(1)").textContent = "Filter by Species";
        document.querySelector("#species-filter option:nth-child(2)").textContent = "Human";
        document.querySelector("#species-filter option:nth-child(3)").textContent = "Alien";
        document.querySelector("#sort-filter option:nth-child(1)").textContent = "Sort By";
        document.querySelector("#sort-filter option:nth-child(2)").textContent = "Name";
        document.querySelector("#sort-filter option:nth-child(3)").textContent = "Origin";
        
    }
});

window.addEventListener("load", async () => {
  await loadMoreCharacters();
});