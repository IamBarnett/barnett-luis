const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

const sanitizeName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '');
};

const getPokemon = async (name) => {
  const response = await fetch(`${POKE_API_URL}/${name}/`);
  if (!response.ok) throw new Error('Pokémon not found');
  return response.json();
};

const renderPokemon = (template, pokemon) => {
  const { id, name, sprites, weight, height, abilities } = pokemon;
  const html = `
    <div class="pokemon-card">
      <div class="pokemon-card_header">
        <h2>${name.charAt(0).toUpperCase() + name.slice(1)} (${id})</h2>
      </div>
      <div class="pokemon-card_body">
        <div class="pokemon-sprites">
          <h3>Sprites</h3>
          <img src="${sprites.front_default}" alt="${name} front" />
          <img src="${sprites.back_default}" alt="${name} back" />
        </div>
        <div class="pokemon-stats">
          <h3>Weight / Height</h3>
          <p>${weight / 10} kg / ${height / 10} m</p>
        </div>
        <div class="pokemon-abilities">
          <h3>Habilidades</h3>
          <ul>${abilities.map(({ ability }) => `<li>${ability.name}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  `;
  template.innerHTML = html;
};

export {
  getPokemon,
  renderPokemon,
  sanitizeName,
};



