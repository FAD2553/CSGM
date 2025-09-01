document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.category-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Retire la classe active de tous les boutons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Ajoute la classe active au bouton cliqué
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-category');
      
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
