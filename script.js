const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const stats = document.querySelectorAll('[data-count]');
const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.count);
    const duration = 1300;
    const start = performance.now();
    const updateCounter = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString() + '+';
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    requestAnimationFrame(updateCounter);
    observer.unobserve(counter);
  });
}, { threshold: 0.7 });
stats.forEach((stat) => statsObserver.observe(stat));

function showFormMessage(form, message, isError = false) {
  const messageElement = form.querySelector('.form-message');
  messageElement.textContent = message;
  messageElement.style.color = isError ? '#c64c38' : 'var(--green)';
}

function bindDemoForm(formId, message) {
  const form = document.querySelector(formId);
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showFormMessage(form, message);
    form.reset();
  });
}

const donationPanel = document.querySelector('.donate-section .form-panel');
if (donationPanel) {
  donationPanel.innerHTML = `
    <div class="form-panel-top"><h3>Ways to donate</h3><span class="secure-label">HopeBridge</span></div>
    <div style="display:grid;gap:16px;margin-top:24px">
      <div style="padding-bottom:14px;border-bottom:1px solid var(--line)"><strong>JazzCash Account</strong><br><span style="color:var(--muted)">0300-0000000</span></div>
      <div style="padding-bottom:14px;border-bottom:1px solid var(--line)"><strong>Easypaisa Account</strong><br><span style="color:var(--muted)">0301-0000000</span></div>
      <div style="padding-bottom:14px;border-bottom:1px solid var(--line)"><strong>HBL Account</strong><br><span style="color:var(--muted)">HopeBridge HBL 001</span></div>
      <div style="padding-bottom:14px;border-bottom:1px solid var(--line)"><strong>UBL Account</strong><br><span style="color:var(--muted)">HopeBridge UBL 001</span></div>
      <div><strong>PayPal Account</strong><br><span style="color:var(--muted)">donate@hopebridge.org</span></div>
    </div>`;
}

const contactPanel = document.querySelector('.contact-form-wrap');
if (contactPanel) {
  contactPanel.innerHTML = `
    <div class="form-panel-top"><h3>Contact HopeBridge</h3><span class="secure-label">We're here to help</span></div>
    <div style="display:grid;gap:22px;margin-top:28px">
      <div><strong>Email address</strong><br><a href="mailto:info@hopebridge.org" style="color:var(--coral)">info@hopebridge.org</a></div>
      <div><strong>Phone number</strong><br><a href="tel:+923001234567" style="color:var(--coral)">+92 300 1234567</a></div>
      <div><strong>Office location</strong><br><span style="color:var(--muted)">Islamabad, Pakistan</span></div>
    </div>`;
}

const volunteerForm = document.querySelector('#volunteer-form');
if (volunteerForm) {
  const tallyFrame = document.createElement('iframe');
  tallyFrame.src = 'https://tally.so/r/dWM1Bo?transparentBackground=1&hideTitle=1';
  tallyFrame.title = 'Volunteer registration form';
  tallyFrame.loading = 'lazy';
  tallyFrame.style.width = '100%';
  tallyFrame.style.minHeight = '700px';
  tallyFrame.style.border = '0';
  volunteerForm.replaceWith(tallyFrame);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
