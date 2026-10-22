const stages = [
  { name: 'Nouveau', key: 'new', count: 0 },
  { name: 'Contacté', key: 'contacted', count: 1 },
  { name: 'Visite', key: 'visit', count: 1 },
  { name: 'Offre', key: 'offer', count: 0 },
  { name: 'Dossier ouvert', key: 'case_open', count: 1 },
  { name: 'Gagné', key: 'won', count: 0 },
  { name: 'Perdu', key: 'lost', count: 0 },
];

const contacts = [
  { name: 'Amine Rami', initials: 'AR', stage: 'contacted', detail: 'Appartement familial à Casablanca', location: 'Casablanca · Youssef El Idrissi', action: 'Clarifier le besoin et proposer un rendez-vous', due: 'En retard · 20 oct.', late: true },
  { name: 'Lina Démo', initials: 'LD', stage: 'visit', detail: 'Appartement jardin · Marrakech', location: 'Marrakech · Nadia Bennani', action: 'Préparer la visite fictive', due: '23 oct.', late: false },
  { name: 'Sofia El Mansouri', initials: 'SE', stage: 'case_open', detail: 'Appartement à Rabat', location: 'Rabat · Nadia Bennani', action: 'Vérifier les pièces manquantes', due: '24 oct.', late: false },
];

const buildings = document.querySelector('#buildings');
const legend = document.querySelector('#legend');
const list = document.querySelector('#contact-list');
const resultCount = document.querySelector('#result-count');
const viewport = document.querySelector('.atlas-viewport');
let selectedStage = null;

for (const [index, stage] of stages.entries()) {
  const building = document.createElement('button');
  building.type = 'button';
  building.className = `atlas-building building-${index} stage-${stage.key} level-${stage.count ? 3 + stage.count : 0}`;
  building.dataset.stage = stage.key;
  building.setAttribute('aria-label', `Étape ${index + 1} : ${stage.name}, ${stage.count} contact${stage.count > 1 ? 's' : ''}`);
  building.innerHTML = `<span class="building-shadow"></span><span class="building-front"></span><span class="building-side"></span><span class="building-roof"><span>${String(index + 1).padStart(2, '0')}</span></span>`;
  building.addEventListener('click', () => selectStage(stage.key));
  buildings.append(building);

  const item = document.createElement('button');
  item.type = 'button';
  item.dataset.stage = stage.key;
  item.innerHTML = `<span class="legend-number">${String(index + 1).padStart(2, '0')}</span><span>${stage.name}</span><strong>${stage.count}</strong>`;
  item.addEventListener('click', () => selectStage(stage.key));
  legend.append(item);
}

function selectStage(key) {
  selectedStage = selectedStage === key ? null : key;
  document.querySelectorAll('[data-stage]').forEach((element) => {
    const active = element.dataset.stage === selectedStage;
    element.setAttribute('aria-pressed', String(active));
    element.classList.toggle('selected', active);
  });
  renderContacts();
}

function renderContacts() {
  const visible = contacts.filter((contact) => !selectedStage || contact.stage === selectedStage);
  resultCount.textContent = selectedStage
    ? `${visible.length} contact${visible.length > 1 ? 's' : ''} dans l’étape ${stages.find((stage) => stage.key === selectedStage).name.toLowerCase()}. Sélectionnez-la à nouveau pour tout voir.`
    : '3 contacts fictifs · 3 prochaines actions';
  list.replaceChildren();
  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Aucun contact fictif dans cette étape. Sélectionnez-la à nouveau pour voir tout le parcours.';
    list.append(empty);
    return;
  }
  for (const contact of visible) {
    const card = document.createElement('article');
    card.className = 'contact-card';
    const top = document.createElement('div');
    top.className = 'card-top';
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = contact.initials;
    const due = document.createElement('strong');
    due.className = contact.late ? 'due late' : 'due';
    due.textContent = `• ${contact.due}`;
    top.append(avatar, due);
    const heading = document.createElement('h3');
    heading.textContent = contact.name;
    const detail = document.createElement('p');
    detail.textContent = contact.detail;
    const location = document.createElement('p');
    location.className = 'meta';
    location.textContent = contact.location;
    const action = document.createElement('p');
    action.className = 'action';
    action.textContent = contact.action;
    card.append(top, heading, detail, location, action);
    list.append(card);
  }
}

document.querySelectorAll('[data-turn]').forEach((button) => {
  button.addEventListener('click', () => {
    viewport.dataset.angle = button.dataset.turn;
    document.querySelectorAll('[data-turn]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
  });
});
document.querySelector('[data-turn="center"]').setAttribute('aria-pressed', 'true');
renderContacts();
