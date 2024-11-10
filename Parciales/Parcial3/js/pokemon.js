const API_BASE_URL_POKEMON = "https://pokeapi.co/api/v2/pokemon";
const API_BASE_URL_EVOLUTION = "https://pokeapi.co/api/v2/pokemon-species/";
const API_BASE_URL_ABILITIES = "https://pokeapi.co/api/v2/ability/";

const cleanPokemonName = (pokemonName) => {
  return pokemonName.trim().toLowerCase().replace(/[^a-z][-][a-z]/g, "");
};

const fetchPokemonData = async (pokemonName) => {
  const response = await fetch(`${API_BASE_URL_POKEMON}/${pokemonName}/`);
  if (!response.ok) alert("El nombre del Pokémon ingresado no es válido.");
  return response.json();
};

const fetchEvolutionData = async (pokemonName) => {
  const response = await fetch(`${API_BASE_URL_EVOLUTION}/${pokemonName}/`);
  const speciesData = await response.json();
  const evolutionUrl = speciesData.evolution_chain.url;

  const evolutionResponse = await fetch(evolutionUrl);
  const evolutionChainData = await evolutionResponse.json();

  const evolutionList = [];

  const extractEvolutions = (evolutionStage) => {
    evolutionList.push({
      name: evolutionStage.species.name,
      is_baby: evolutionStage.is_baby || false,
    });
    evolutionStage.evolves_to.forEach((nextStage) => {
      extractEvolutions(nextStage);
    });
  };
  
  extractEvolutions(evolutionChainData.chain);

  return evolutionList;
};

const fetchAbilityData = async (abilityName) => {
  const response = await fetch(`${API_BASE_URL_ABILITIES}/${abilityName}/`);
  if (!response.ok) alert("El nombre de la habilidad ingresado no es válido.");
  return response.json();
};

const displayPokemonData = (container, pokemonData, evolutionList) => {
  const { id, name, sprites, weight, height, abilities } = pokemonData;

  const pokemonHtml = `
    <div class="pokemon-card">
      <div class="pokemon-card-header">
        <h2>${name.charAt(0).toUpperCase() + name.slice(1)} (#${id})</h2>
      </div>
      <div class="pokemon-card-body">
        <div class="pokemon-images-and-evolutions">
          <h3>Sprites</h3>
          <img src="${sprites.front_default}" alt="${name} front" />
          <img src="${sprites.back_default || sprites.front_shiny}" alt="${name} back" />
          <h3>Evolution Chain</h3>
          <ul>
            ${evolutionList.map((evolution) => {
              const evolutionName = evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1);
              return `<li>${evolutionName} ${evolution.is_baby ? "" : ""}</li>`;
            }).join('')}
          </ul>
        </div>
        <div class="pokemon-stats-and-abilities">
          <h3>Weight / Height</h3>
          <p>${weight / 10} kg / ${height / 10} m</p>
          <h3>Abilities</h3>
          <ul>
            ${abilities.map(({ ability, is_hidden }) => `<li>${ability.name} ${is_hidden ? "🙈" : ""}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = pokemonHtml;
};

const displayAbilityData = (container, abilityData) => {
  const { name, pokemon } = abilityData;
  const abilityHtml = `
    <div class="ability-card">
      <div class="ability-card-header">
        <h2>${name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      </div>
      <div class="ability-card-body">
        <h3>Pokémon that can learn this ability:</h3>
        <ul>
          ${pokemon.map(({ pokemon }) => `<li>${pokemon.name}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
  container.innerHTML = abilityHtml;
};

export {
  fetchPokemonData,
  cleanPokemonName,
  displayPokemonData,
  fetchEvolutionData,
  fetchAbilityData,
  displayAbilityData,
};
