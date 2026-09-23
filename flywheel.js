document.querySelectorAll('[data-flywheel-mount]').forEach((mount) => {
  mount.innerHTML = `
    <div class="flywheel" data-flywheel>
      <svg class="flywheel-lines" viewBox="0 0 380 330" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="flywheel-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent)"></path>
          </marker>
        </defs>
        <path d="M230 118 C258 142 282 174 294 210" marker-end="url(#flywheel-arrowhead)"></path>
        <path d="M246 262 C210 282 168 282 132 262" marker-end="url(#flywheel-arrowhead)"></path>
        <path d="M88 210 C100 174 124 142 152 118" marker-end="url(#flywheel-arrowhead)"></path>
        <g class="flywheel-core" transform="translate(190 205)">
          <ellipse rx="66" ry="33"></ellipse>
          <text y="-7">Movement</text>
          <text y="11">power</text>
        </g>
      </svg>
      <button class="flywheel-node flywheel-node-top" type="button" data-step="act" aria-pressed="false">
        <span class="flywheel-label">Act</span>
        <span class="flywheel-tip">Visible, peaceful pressure makes AI governance impossible to ignore.</span>
      </button>
      <button class="flywheel-node flywheel-node-right" type="button" data-step="recruit" aria-pressed="false">
        <span class="flywheel-label">Recruit</span>
        <span class="flywheel-tip">Every public action creates conversations, gatherings, and local relationships.</span>
      </button>
      <button class="flywheel-node flywheel-node-left" type="button" data-step="train" aria-pressed="false">
        <span class="flywheel-label">Train</span>
        <span class="flywheel-tip">New advocates learn organizing skills and become leaders for the next action.</span>
      </button>
    </div>
  `;

  const nodes = Array.from(mount.querySelectorAll('.flywheel-node[data-step]'));
  const activateStep = (step) => {
    nodes.forEach((node) => {
      const isActive = node.dataset.step === step;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-pressed', String(isActive));
    });
  };

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => activateStep(node.dataset.step));
    node.addEventListener('mouseleave', () => activateStep(null));
    node.addEventListener('focus', () => activateStep(node.dataset.step));
    node.addEventListener('click', () => activateStep(node.dataset.step));
  });
});
