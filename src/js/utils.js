import $ from './elements';

const projectKey = 'space-game';

export function costCalculator(level, multiplier = 1.5) {
  let value = level;

  if (level === 0) {
    value = 1;
  }
  return +(multiplier ** value + 5).toFixed(2);
}

export function loadSavedGame(_) {
  const savedGame = localStorage.getItem(`${projectKey}save`);

  if (savedGame) {
    Object.assign(_, JSON.parse(savedGame));
  }
}

export function saveGame(_) {
  localStorage.setItem(`${projectKey}save`, JSON.stringify(_));

  $.saveGame.innerText = 'Game Saved!';

  setTimeout(() => {
    $.saveGame.innerText = 'Save';
  }, 5000);
}

export function resetGame() {
  localStorage.removeItem(`${projectKey}save`);
  window.location.reload();
}
