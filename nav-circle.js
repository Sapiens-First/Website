(function () {
  function j(n, d) { return +(n + (Math.random() - 0.5) * 2 * d).toFixed(1); }

  function makeUnderline() {
    var y = j(3, 2);
    return (
      'M ' + j(1,2)  + ',' + j(y,1.5) +
      ' C 25,' + j(y-1.5,2) + ' 50,' + j(y+2,2)   + ' 75,' + j(y,2) +
      ' C 88,' + j(y-1,2)   + ' 95,' + j(y+1.5,2) + ' ' + j(99,2) + ',' + j(y,1.5)
    );
  }

  document.querySelectorAll('.site-nav .nav-link.active').forEach(function (link) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('nav-underline');
    svg.setAttribute('viewBox', '0 0 100 8');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', makeUnderline());
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    link.appendChild(svg);
  });
})();
