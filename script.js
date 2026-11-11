const selectOne = (selector, parent = document) => parent.querySelector(selector);
const selectAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const services = [
  {
    id: 'Construction',
    title: 'Construction',
    description:
      'From foundations to finishing, we handle residential, commercial and industrial building work with a site engineer on every job.',
    features: [
      'Foundations, slabs and RCC structures',
      'Brickwork, plastering and finishing',
      'Boundary walls, roads and drainage',
      'Renovation and repair work',
    ],
    note: 'Free site visit and written estimate.',
  },
  {
    id: 'Electrical',
    title: 'Electrical',
    description:
      'Licensed electricians for new wiring, panels and maintenance, tested and signed off before handover.',
    features: [
      'House and building wiring',
      'Distribution panels and earthing',
      'Lighting, fans and fittings',
      'Fault finding and maintenance',
    ],
    note: 'Same-week start for most jobs.',
  },
  {
    id: 'Labour',
    title: 'Labour supply',
    description:
      'Trained workers sent to your site on daily, weekly or monthly terms, with a supervisor to keep the team on track.',
    features: [
      'Masons, helpers and carpenters',
      'Electricians and plumbers',
      'Bar benders and shuttering crews',
      'Daily, weekly or monthly terms',
    ],
    note: 'Crew of 5 to 100 available.',
  },
  {
    id: 'JCB',
    title: 'JCB hire',
    description:
      'Excavators and loaders with experienced operators for digging, levelling and loading, by the hour or by the day.',
    features: [
      'JCB 3DX backhoe loader',
      'Mini excavator for tight spaces',
      'Poclain for heavy digging',
      'Operator and fuel options',
    ],
    note: 'Use the estimator below for a quick price.',
  },
];

const machines = [
  { name: 'JCB 3DX backhoe loader', ratePerHour: 1000 },
  { name: 'Mini excavator', ratePerHour: 800 },
  { name: 'Poclain excavator', ratePerHour: 1800 },
];

const FUEL_COST_PER_HOUR = 250;

const projects = [
  {
    name: 'Apartment block, 4 floors',
    category: 'Construction',
    description: 'RCC frame, masonry and finishing.',
  },
  {
    name: 'Warehouse shed and flooring',
    category: 'Construction',
    description: 'Steel shed with industrial floor.',
  },
  {
    name: 'Factory power distribution',
    category: 'Electrical',
    description: 'New panels, cabling and earthing.',
  },
  {
    name: 'Showroom lighting retrofit',
    category: 'Electrical',
    description: 'LED lighting and fresh wiring.',
  },
  {
    name: 'Highway culvert crew',
    category: 'Labour',
    description: '60 workers over three months.',
  },
  {
    name: 'Plot levelling, 2 acres',
    category: 'JCB',
    description: 'Excavation and soil removal.',
  },
];

const formatRupees = amount => '₹' + amount.toLocaleString('en-IN');

/* mobile menu */
const navMenu = selectOne('#nav');
const menuButton = selectOne('#burger');

const toggleMenu = isOpen => {
  navMenu.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.textContent = isOpen ? '✕' : '☰';
};

menuButton.onclick = () => toggleMenu(!navMenu.classList.contains('open'));
navMenu.onclick = event => event.target.closest('a') && toggleMenu(false);
addEventListener('keydown', event => event.key === 'Escape' && toggleMenu(false));

/* service tabs */
const tabList = selectOne('#tabs');

tabList.innerHTML = services
  .map(
    (service, index) =>
      `<button class="tab" role="tab" id="t-${service.id}" aria-selected="${index === 0}" aria-controls="p-${service.id}" data-id="${service.id}">${service.title}</button>`
  )
  .join('');

selectOne('#panels').innerHTML = services
  .map(
    (service, index) =>
      `<div class="panel" role="tabpanel" id="p-${service.id}" ${index ? 'hidden' : ''}>
        <div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <ul>${service.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
          <button class="btn pri" data-req="${service.id}">Request ${service.title}</button>
        </div>
        <div class="tag"><b>Good to know</b>${service.note}</div>
      </div>`
  )
  .join('');

const selectServiceTab = serviceId => {
  selectAll('.tab', tabList).forEach(tab => {
    tab.setAttribute('aria-selected', tab.dataset.id === serviceId);
  });

  selectAll('.panel').forEach(panel => {
    panel.hidden = panel.id !== 'p-' + serviceId;
  });
};

tabList.onclick = event => {
  const clickedTab = event.target.closest('.tab');
  clickedTab && selectServiceTab(clickedTab.dataset.id);
};

tabList.onkeydown = event => {
  const allTabs = selectAll('.tab', tabList);
  const currentIndex = allTabs.findIndex(tab => tab === document.activeElement);

  if (currentIndex < 0 || !['ArrowRight', 'ArrowLeft'].includes(event.key)) return;

  const step = event.key === 'ArrowRight' ? 1 : allTabs.length - 1;
  const nextTab = allTabs[(currentIndex + step) % allTabs.length];

  nextTab.focus();
  selectServiceTab(nextTab.dataset.id);
};

const WHATSAPP_NUMBER = '919046915053';
const openWhatsApp = message =>
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener'
  );

selectOne('#panels').onclick = event => {
  const requestButton = event.target.closest('[data-req]');
  if (!requestButton) return;

  const service = services.find(item => item.id === requestButton.dataset.req);
  openWhatsApp(`Hello Friends Trading Company, I need ${service.title}. Please contact me.`);
};

/* JCB estimator */
const machineSelect = selectOne('#mach');
const hoursInput = selectOne('#hrs');
const fuelCheckbox = selectOne('#fuel');
const estimateAmount = selectOne('#amt');
const estimateBreakdown = selectOne('#brk');
const hoursError = selectOne('#hErr');
const requestMachineButton = selectOne('#useEst');

machineSelect.innerHTML = machines
  .map(
    (machine, index) =>
      `<option value="${index}">${machine.name} (${formatRupees(machine.ratePerHour)}/hr)</option>`
  )
  .join('');

const updateEstimate = () => {
  const hours = Number(hoursInput.value);
  const isValidHours = Number.isInteger(hours) && hours >= 1 && hours <= 240;

  hoursError.textContent = isValidHours ? '' : 'Enter whole hours from 1 to 240.';
  requestMachineButton.disabled = !isValidHours;

  if (!isValidHours) {
    estimateAmount.textContent = '₹0';
    estimateBreakdown.textContent = '';
    return;
  }

  const machine = machines[machineSelect.value];
  const fuelTotal = fuelCheckbox.checked ? FUEL_COST_PER_HOUR * hours : 0;
  const totalCost = machine.ratePerHour * hours + fuelTotal;

  estimateAmount.textContent = formatRupees(totalCost);
  estimateBreakdown.textContent = `${hours} hr × ${formatRupees(machine.ratePerHour)}${fuelTotal ? ' + fuel ' + formatRupees(fuelTotal) : ''}, operator included`;
  estimateAmount.classList.add('pop');
  setTimeout(() => estimateAmount.classList.remove('pop'), 180);
};

[machineSelect, hoursInput, fuelCheckbox].forEach(control => {
  control.addEventListener('input', updateEstimate);
});

selectOne('#calc').onsubmit = event => event.preventDefault();

requestMachineButton.onclick = () => {
  const machine = machines[machineSelect.value];
  openWhatsApp(
    `Hello Friends Trading Company, I need a ${machine.name} for ${hoursInput.value} hours${fuelCheckbox.checked ? ' with fuel' : ''}. Estimate ${estimateAmount.textContent}.`
  );
};

updateEstimate();

/* project filter */
const projectCategories = ['All', ...new Set(projects.map(project => project.category))];
const filterChips = selectOne('#chips');

filterChips.innerHTML = projectCategories
  .map(
    (category, index) =>
      `<button class="tab" aria-selected="${index === 0}" data-c="${category}">${category}</button>`
  )
  .join('');

selectOne('#grid').innerHTML = projects
  .map(
    project =>
      `<article class="card" data-c="${project.category}">
        <div class="thumb">${project.category}</div>
        <div>
          <h3>${project.name}</h3>
          <p>${project.description}</p>
        </div>
      </article>`
  )
  .join('');

filterChips.onclick = event => {
  const clickedChip = event.target.closest('[data-c]');
  if (!clickedChip) return;

  selectAll('.tab', filterChips).forEach(chip => {
    chip.setAttribute('aria-selected', chip === clickedChip);
  });

  selectAll('.card').forEach(card => {
    card.hidden = clickedChip.dataset.c !== 'All' && card.dataset.c !== clickedChip.dataset.c;
  });
};

/* stat counters and active menu link */
const statObserver = new IntersectionObserver(
  entries =>
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      statObserver.unobserve(entry.target);
      const targetNumber = Number(entry.target.dataset.n);
      const startTime = performance.now();

      const countUp = currentTime => {
        const progress = Math.min((currentTime - startTime) / 1200, 1);
        entry.target.textContent = Math.round(targetNumber * (1 - (1 - progress) ** 3)) + '+';
        progress < 1 && requestAnimationFrame(countUp);
      };

      requestAnimationFrame(countUp);
    }),
  { threshold: 0.6 }
);

selectAll('[data-n]').forEach(stat => statObserver.observe(stat));

const activeLinkObserver = new IntersectionObserver(
  entries =>
    entries.forEach(
      entry =>
        entry.isIntersecting &&
        selectAll('nav a[href^="#"]:not(.btn)').forEach(link => {
          link.classList.toggle('on', link.getAttribute('href') === '#' + entry.target.id);
        })
    ),
  { rootMargin: '-45% 0px -50% 0px' }
);

selectAll('main section').forEach(section => activeLinkObserver.observe(section));
