document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.md-clipboard').forEach(button => {
    const originalTitle = button.title;
    button.addEventListener('click', () => {
      button.title = 'Copied!';
      setTimeout(() => {
        button.title = originalTitle;
      }, 1500);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
