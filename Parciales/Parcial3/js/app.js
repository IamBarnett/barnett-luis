import { getEvolution, renderPokemon, sanitizeName, getPokemon, getAbilities, renderAbilities } from ".Users\luisb\DesktopParcial3Pokeapi/js/pokemon.js";

const elements = {
  form: document.querySelector("form"),
  detailsContainer: document.querySelector("#details"),
  typeSelect: document.querySelector("#type-search"),
};

const actions = {
  handleFormSubmit: async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const selectedType = elements.typeSelect.value;
    const inputName = data.get("pokemon-name");
    const cleanName = sanitizeName(inputName);

    if (!cleanName) {
      alert("Ingrese un nombre válido.");
      return;
    }

    if (selectedType === "pokemon") {
      const pokemonData = await getPokemon(cleanName);
      const evolutionData = await getEvolution(cleanName);
      pokemonData.evolution_chain = evolutionData;
      renderPokemon(elements.detailsContainer, pokemonData, evolutionData);
    } else if (selectedType === "abilities") {
      const abilitiesData = await getAbilities(cleanName);
      renderAbilities(elements.detailsContainer, abilitiesData);
    }
  },
  handleTypeChange: () => {
    elements.detailsContainer.innerHTML = "";
  },
};

const setupEventListeners = () => {
  elements.form.addEventListener("submit", actions.handleFormSubmit);
  elements.typeSelect.addEventListener("change", actions.handleTypeChange);
};

const initializeApp = () => {
  setupEventListeners();
};

initializeApp();


