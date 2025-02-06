// Add hover effect on cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseover', () => {
    card.classList.add('hover');
  });
  
  card.addEventListener('mouseout', () => {
    card.classList.remove('hover');
  });
});

// Smooth scroll to the destinations section when the link is clicked
document.querySelector('.nav-links a[href="#destinations"]').addEventListener('click', function (event) {
  event.preventDefault();
  document.querySelector('.grid').scrollIntoView({ behavior: 'smooth' });
});
