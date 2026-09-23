// ─── ACCORDION COMPONENT ──────────────────────────────────────────────────
// Wires up buttons matching toggleSelector, each expected to have its panel
// as the very next sibling. Toggling sets aria-expanded on the button and
// `.is-open` on the panel; the panel's own CSS drives the expand animation.
//
//   createAccordion(selector, { exclusive, onOpen })
//     exclusive: close every other match when one opens (default false)
//     onOpen(toggle): called after a toggle opens, incl. via .open()
//
// Returns { open(card) } to open a card/toggle programmatically (e.g. from
// a deep link), reusing the same exclusivity + onOpen behavior as a click.

function createAccordion(toggleSelector, opts) {
  opts = opts || {};
  var toggles = Array.from(document.querySelectorAll(toggleSelector));

  function closeToggle(toggle) {
    var panel = toggle.nextElementSibling;
    toggle.setAttribute('aria-expanded', 'false');
    if (panel) panel.classList.remove('is-open');
  }

  function openToggle(toggle) {
    if (opts.exclusive) {
      toggles.forEach(function (other) {
        if (other !== toggle) closeToggle(other);
      });
    }
    var panel = toggle.nextElementSibling;
    toggle.setAttribute('aria-expanded', 'true');
    if (panel) panel.classList.add('is-open');
    if (opts.onOpen) opts.onOpen(toggle);
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeToggle(toggle); else openToggle(toggle);
    });
  });

  return {
    open: function (card) {
      var toggle = card.matches(toggleSelector) ? card : card.querySelector(toggleSelector);
      if (toggle) openToggle(toggle);
    }
  };
}

// Enhance native FAQ details, keeping each FAQ group independent.
document.querySelectorAll('.faq-acc').forEach(function (group) {
  var items = Array.from(group.querySelectorAll('details.faq-item'));
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var controllers = items.map(function (item) {
    var summary = item.querySelector('summary');
    var body = item.querySelector('.faq-body');
    var expanded = item.open;
    var animation = null;

    function setExpanded(next) {
      if (next === expanded) return;
      expanded = next;
      var startHeight = item.getBoundingClientRect().height;
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      summary.setAttribute('aria-expanded', String(next));
      body.inert = !next;
      // Measure the destination at its natural height before animating.
      item.open = next;
      var endHeight = item.getBoundingClientRect().height;
      if (reducedMotion.matches || !item.animate) return;

      // Keep the answer rendered until its closing animation finishes.
      item.open = true;
      animation = item.animate([
        { height: startHeight + 'px', overflow: 'hidden', boxSizing: 'border-box' },
        { height: endHeight + 'px', overflow: 'hidden', boxSizing: 'border-box' }
      ], { duration: 280, easing: 'cubic-bezier(.2, 0, 0, 1)' });
      animation.onfinish = function () {
        item.open = expanded;
        animation = null;
      };
    }

    summary.setAttribute('aria-expanded', String(expanded));
    body.inert = !expanded;
    summary.addEventListener('click', function (event) {
      // Preserve links or other controls embedded in a question.
      if (event.target.closest('a, button, input, select, textarea')) return;
      event.preventDefault();
      var next = !expanded;
      controllers.forEach(function (controller) {
        controller.setExpanded(controller.item === item && next);
      });
    });
    return { item: item, setExpanded: setExpanded };
  });

  // Normalize markup that happens to have more than one initial open answer.
  var firstOpen = items.find(function (item) { return item.open; });
  controllers.forEach(function (controller) {
    if (controller.item !== firstOpen) controller.setExpanded(false);
  });
});
