document.addEventListener('click', function(e) {
  if (e.target.closest('input[placeholder*="deployment"]') || e.target.closest('input[placeholder*="convex"]')) {
    e.target.parentElement.style.display = 'block !important';
  }
}, true);