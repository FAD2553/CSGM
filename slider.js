// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM chargé, initialisation du slider...');
  
  // Sélectionner les éléments
  const galleryContainer = document.querySelector('.gallery-container');
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  // Éléments optionnels (peuvent être null)
  const prevButton = document.querySelector('.gallery-prev');
  const nextButton = document.querySelector('.gallery-next');
  const dotsContainer = document.querySelector('.gallery-dots');
  
  console.log('Éléments trouvés:', {
    galleryContainer,
    galleryTrack,
    galleryItems: galleryItems.length,
    categoryButtons: categoryButtons.length,
    prevButton,
    nextButton,
    dotsContainer
  });
  
  if (!galleryContainer || !galleryTrack) {
    console.error('Éléments de galerie manquants');
    return;
  }
  
  // Variables pour le défilement
  let scrollPosition = 0;
  let cardWidth = 320; // Largeur d'une carte + gap
  let visibleCards = 4; // Nombre de cartes visibles
  let currentFilter = 'all';
  
  // Initialisation
  function initGallery() {
    // Mettre à jour la largeur des cartes
    updateCardWidth();
    
    // Créer les points de navigation
    createDots();
    
    // Démarrer le défilement automatique
    startAutoScroll();
    
    // Mettre à jour les éléments visibles
    updateVisibleItems();
  }
  
  // Mettre à jour la largeur des cartes en fonction de l'écran
  function updateCardWidth() {
    const item = document.querySelector('.gallery-item');
    if (item) {
      const style = window.getComputedStyle(item);
      const margin = parseFloat(style.marginRight);
      cardWidth = item.offsetWidth + margin;
      
      // Ajuster le nombre de cartes visibles
      visibleCards = Math.floor(window.innerWidth / cardWidth);
      if (visibleCards > 4) visibleCards = 4;
      if (visibleCards < 1) visibleCards = 1;
    }
  }
  
  // Créer les points de navigation
  function createDots() {
    dotsContainer.innerHTML = '';
    const itemCount = document.querySelectorAll(`.gallery-item[data-category="${currentFilter}"], .gallery-item[data-category=""]`).length;
    
    for (let i = 0; i < itemCount; i++) {
      const dot = document.createElement('span');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToItem(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  // Mettre à jour les éléments visibles en fonction du filtre
  function updateVisibleItems() {
    console.log('Filtrage des éléments pour la catégorie:', currentFilter);
    
    // Désactiver le défilement automatique
    stopAutoScroll();
    
    // Mettre à jour les classes du conteneur
    if (currentFilter === 'all') {
      galleryContainer.classList.remove('category-view');
      galleryTrack.style.flexWrap = 'nowrap';
      galleryTrack.style.justifyContent = 'flex-start';
      galleryTrack.style.overflowX = 'auto';
      galleryTrack.style.animation = 'scroll 30s linear infinite';
      galleryContainer.style.overflow = 'hidden';
    } else {
      galleryContainer.classList.add('category-view');
      galleryTrack.style.flexWrap = 'wrap';
      galleryTrack.style.justifyContent = 'flex-start';
      galleryTrack.style.overflowX = 'visible';
      galleryTrack.style.animation = 'none';
      galleryContainer.style.overflow = 'visible';
    }
    
    // Mettre à jour la visibilité des éléments
    let hasVisibleItems = false;
    
    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const shouldShow = currentFilter === 'all' || category === currentFilter;
      
      if (shouldShow) {
        item.style.display = 'block';
        item.classList.add('visible');
        hasVisibleItems = true;
        
        if (currentFilter === 'all') {
          // Mode défilement horizontal
          item.style.flex = '0 0 300px';
          item.style.margin = '0 15px 0 0';
          item.style.maxWidth = 'none';
        } else {
          // Mode grille pour les catégories spécifiques
          item.style.flex = ''; // Laisser le CSS gérer
          item.style.margin = '';
          item.style.maxWidth = '';
        }
      } else {
        item.style.display = 'none';
        item.classList.remove('visible');
      }
    });
    
    // Si aucun élément n'est visible, afficher un message
    const noItemsMessage = document.querySelector('.no-items-message');
    if (!hasVisibleItems) {
      if (!noItemsMessage) {
        const message = document.createElement('p');
        message.className = 'no-items-message';
        message.textContent = 'Aucun élément trouvé dans cette catégorie.';
        galleryTrack.appendChild(message);
      }
    } else if (noItemsMessage) {
      noItemsMessage.remove();
    }
    
    // Si on est sur 'Tout voir', on redémarre le défilement
    if (currentFilter === 'all') {
      startAutoScroll();
    }
    
    // Mise à jour du style du conteneur
    if (currentFilter === 'all') {
      galleryContainer.classList.remove('category-view');
      galleryTrack.style.flexWrap = 'nowrap';
      galleryTrack.style.justifyContent = 'flex-start';
      galleryTrack.style.overflowX = 'auto';
      galleryTrack.style.animation = 'scroll 30s linear infinite';
      galleryContainer.style.overflow = 'hidden';
      createDots();
    } else {
      galleryContainer.classList.add('category-view');
      galleryTrack.style.flexWrap = 'wrap';
      galleryTrack.style.justifyContent = 'center';
      galleryTrack.style.overflowX = 'visible';
      galleryTrack.style.animation = 'none';
      galleryContainer.style.overflow = 'visible';
      dotsContainer.innerHTML = '';
      scrollPosition = 0;
      updateTrackPosition();
    }
  }
  
  // Mettre à jour la position de la piste de défilement
  function updateTrackPosition() {
    if (currentFilter === 'all') {
      galleryTrack.style.transform = `translateX(${scrollPosition}px)`;
      updateActiveDot();
    } else {
      galleryTrack.style.transform = 'none';
    }
  }
  
  // Mettre à jour le point actif
  function updateActiveDot() {
    const dots = document.querySelectorAll('.gallery-dot');
    if (dots.length === 0) return;
    
    const itemWidth = cardWidth * visibleCards;
    const activeIndex = Math.abs(Math.floor(scrollPosition / itemWidth)) % dots.length;
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }
  
  // Aller à un élément spécifique
  function goToItem(index) {
    const itemWidth = cardWidth * visibleCards;
    scrollPosition = -index * itemWidth;
    updateTrackPosition();
    resetAutoScroll();
  }
  
  // Défilement vers la gauche
  function scrollLeft() {
    const itemWidth = cardWidth * visibleCards;
    const maxScroll = -((galleryItems.length - visibleCards) * cardWidth);
    
    scrollPosition += itemWidth;
    if (scrollPosition > 0) {
      scrollPosition = maxScroll;
    }
    
    updateTrackPosition();
    resetAutoScroll();
  }
  
  // Défilement vers la droite
  function scrollRight() {
    const itemWidth = cardWidth * visibleCards;
    const maxScroll = -((galleryItems.length - visibleCards) * cardWidth);
    
    scrollPosition -= itemWidth;
    if (scrollPosition < maxScroll) {
      scrollPosition = 0;
    }
    
    updateTrackPosition();
    resetAutoScroll();
  }
  
  // Gestion du défilement automatique
  let autoScrollInterval;
  
  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(scrollRight, 4000);
  }
  
  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }
  }
  
  function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }
  
  // Événements - uniquement si les éléments existent
  if (prevButton) prevButton.addEventListener('click', scrollLeft);
  if (nextButton) nextButton.addEventListener('click', scrollRight);
  
  // Gestion du survol
  if (galleryContainer) {
    galleryContainer.addEventListener('mouseenter', stopAutoScroll);
    galleryContainer.addEventListener('mouseleave', startAutoScroll);
  }
  
  // Gestion du redimensionnement de la fenêtre
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCardWidth();
      updateTrackPosition();
    }, 250);
  });
  
  // Gestion des boutons de catégorie
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Mettre à jour l'état actif des boutons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Mettre à jour le filtre
      const newFilter = this.getAttribute('data-category');
      
      // Mettre à jour la classe du conteneur
      if (newFilter === 'all') {
        galleryContainer.classList.remove('category-view');
        startAutoScroll();
      } else {
        galleryContainer.classList.add('category-view');
        stopAutoScroll();
      }
      
      currentFilter = newFilter;
      updateVisibleItems();
    });
  });
  
  // Initialiser la galerie
  initGallery();
  
  // Démarrer le défilement automatique uniquement pour 'Tous'
  if (currentFilter === 'all') {
    startAutoScroll();
  }
});
