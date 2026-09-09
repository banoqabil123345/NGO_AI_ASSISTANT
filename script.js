// Add the Make.com webhook URL here when the scenario is ready.
const MAKE_WEBHOOK_URL = "PASTE_YOUR_MAKE_WEBHOOK_URL_HERE";

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

const amountButtons = document.querySelectorAll('.amount-options button');
const customAmount = document.querySelector('#custom-amount');
amountButtons.forEach((button) => {
  button.addEventListener('click', () => {
    amountButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    customAmount.value = button.dataset.amount;
  });
});

document.querySelectorAll('[data-campaign]').forEach((link) => {
  link.addEventListener('click', () => {
    const campaign = document.querySelector('#donor-campaign');
    campaign.value = link.dataset.campaign;
  });
});

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
    amountButtons.forEach((item) => item.classList.remove('selected'));
  });
}

bindDemoForm('#donation-form', 'Thank you for your support! Your donation request has been received.');
bindDemoForm('#contact-form', 'Thank you for reaching out! We will get back to you soon.');

const volunteerForm = document.querySelector('#volunteer-form');
volunteerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!volunteerForm.reportValidity()) return;
  const formData = new FormData(volunteerForm);
  const volunteerData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    areaOfInterest: formData.get('interest'),
    availability: formData.get('availability')
  };
  const isDemoMode = !MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL.includes('PASTE_YOUR');
  if (!isDemoMode) {
    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerData)
      });
      if (!response.ok) throw new Error('Webhook request failed');
    } catch (error) {
      showFormMessage(volunteerForm, 'We could not submit your registration. Please try again.', true);
      return;
    }
  }
  showFormMessage(volunteerForm, 'Thank you for registering! Our team will contact you soon.');
  volunteerForm.reset();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
