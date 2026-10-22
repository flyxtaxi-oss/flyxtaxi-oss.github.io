const roles = {
  agency: {
    eyebrow: 'VUE AGENCE / PROTOTYPE LOCAL',
    title: 'Voir ce qui bloque.<br>Agir au bon moment.',
    description: 'Une vue des dossiers, des informations à confirmer et des prochaines actions pour faire avancer la préparation.',
    points: ['État des dossiers', 'Pièces et responsables', 'Questions à envoyer en revue'],
    miniHead: 'ATLAS HABITAT CONSEIL',
    miniTitle: 'Vue des dossiers',
    miniCount: '02',
    rows: [
      ['DIM–001', 'Appartement · Marrakech', '3 étapes ouvertes'],
      ['DIM–002', 'Appartement · Rabat', '2 étapes ouvertes'],
    ],
  },
  buyer: {
    eyebrow: 'VUE ACHETEUR / PROTOTYPE LOCAL',
    title: 'Savoir ce qu’on sait.<br>Et ce qui manque.',
    description: 'L’acheteur retrouve son questionnaire, ses éléments à confirmer et les pièces à préparer pour son dossier.',
    points: ['Faits confirmés ou manquants', 'Liste de préparation', 'Questions ouvertes'],
    miniHead: 'MON DOSSIER',
    miniTitle: 'Ce que nous savons',
    miniCount: '01',
    rows: [
      ['CONFIRMÉ', 'Résidence habituelle', 'France'],
      ['À CONFIRMER', 'Résidence fiscale', 'Réponse attendue'],
    ],
  },
  pro: {
    eyebrow: 'VUE PROFESSIONNEL / PROTOTYPE LOCAL',
    title: 'Une question précise.<br>Une décision tracée.',
    description: 'Le professionnel assigné voit les points qui relèvent de sa compétence et consigne sa revue dans le dossier.',
    points: ['File de revue assignée', 'Notes et statut', 'Historique daté'],
    miniHead: 'REVUE PROFESSIONNELLE',
    miniTitle: 'Question ouverte',
    miniCount: '01',
    rows: [
      ['DIM–001 / MARRAKECH', 'Titre et propriété', 'À traiter'],
      ['DOSSIER', 'Vérification humaine', 'Requise'],
    ],
  },
};

const tabs = [...document.querySelectorAll('[data-role]')];
const panel = document.querySelector('#role-panel');
const setText = (selector, value) => { document.querySelector(selector).textContent = value; };

function selectRole(role, focus = false) {
  const data = roles[role];
  if (!data) return;
  for (const tab of tabs) {
    const selected = tab.dataset.role === role;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  }
  panel.setAttribute('aria-labelledby', 'tab-' + role);
  setText('#role-eyebrow', data.eyebrow);
  document.querySelector('#role-title').innerHTML = data.title;
  setText('#role-description', data.description);
  document.querySelector('#role-list').replaceChildren(...data.points.map(point => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  }));
  setText('#mini-head', data.miniHead);
  document.querySelector('#mini-title').replaceChildren(document.createTextNode(data.miniTitle + ' '), (() => {
    const count = document.createElement('span');
    count.textContent = data.miniCount;
    return count;
  })());
  data.rows.forEach((row, index) => {
    const number = index + 1;
    setText('#mini-index-' + number, row[0]);
    setText('#mini-case-' + number, row[1]);
    setText('#mini-tag-' + number, row[2]);
  });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panel.classList.remove('role-changing');
    void panel.offsetWidth;
    panel.classList.add('role-changing');
  }
}

for (const tab of tabs) {
  tab.addEventListener('click', () => selectRole(tab.dataset.role));
  tab.addEventListener('keydown', event => {
    const current = tabs.indexOf(tab);
    const target = event.key === 'ArrowRight' ? (current + 1) % tabs.length
      : event.key === 'ArrowLeft' ? (current - 1 + tabs.length) % tabs.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
      : -1;
    if (target < 0) return;
    event.preventDefault();
    selectRole(tabs[target].dataset.role, true);
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px 36px 0px' });
  document.documentElement.classList.add('motion-ready');
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-nav');
const closeMenu = () => {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
};
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const progress = document.querySelector('.reading-progress span');
let progressFrame = 0;
const updateProgress = () => {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0})`;
};
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
