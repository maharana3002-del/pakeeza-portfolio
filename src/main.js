// ============================================================
// PakeezaVerse — main.js (plain JavaScript, no React)
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm'
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/+esm'
import { EMAILJS_CONFIG, isEmailConfigured } from './email-config.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

if (isEmailConfigured()) {
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey })
}

// ---------- Theme ----------
const themeIcon = document.getElementById('themeIcon')

const SUN_PATH =
  'M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4'

const MOON_PATH =
  'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z'

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)

  themeIcon.innerHTML = `<path d="${
    theme === 'dark' ? SUN_PATH : MOON_PATH
  }"/>`

  document
    .getElementById('themeToggle')
    .setAttribute(
      'aria-label',
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
    )
}

const savedTheme = localStorage.getItem('pv-theme')

const initialTheme =
  savedTheme ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light')

applyTheme(initialTheme)

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'

  applyTheme(next)
  localStorage.setItem('pv-theme', next)
})

// ---------- Loader ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done')
  }, 900)
})

// ---------- Navbar scroll state ----------
const nav = document.getElementById('nav')

const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 24)

  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight

  document.getElementById('scrollProgress').style.width =
    `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`

  document
    .getElementById('backToTop')
    .classList.toggle('show', window.scrollY > 600)
}

onScroll()

window.addEventListener('scroll', onScroll, { passive: true })

// ---------- Mobile menu ----------
const burger = document.getElementById('burger')
const mobileMenu = document.getElementById('mobileMenu')

const toggleMenu = (open) => {
  burger.classList.toggle('open', open)
  mobileMenu.classList.toggle('open', open)
  burger.setAttribute('aria-expanded', String(open))
}

burger.addEventListener('click', () => {
  toggleMenu(!burger.classList.contains('open'))
})

mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => toggleMenu(false))
})

// ---------- Back to top ----------
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

// ---------- Cursor glow ----------
const glow = document.getElementById('cursorGlow')

let raf = 0

window.addEventListener('mousemove', (e) => {
  cancelAnimationFrame(raf)

  raf = requestAnimationFrame(() => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
  })
})

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible')
        revealObserver.unobserve(e.target)
      }
    })
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  }
)

document
  .querySelectorAll('.reveal, .skill-card')
  .forEach((el) => revealObserver.observe(el))

// ---------- Typing animation ----------
const ROLES = [
  'BS Information Technology Graduate',
  'Frontend Web Developer',
  'AI Enthusiast',
]

const typedEl = document.getElementById('typed')

let roleIdx = 0
let text = ''
let deleting = false

function tick() {
  const current = ROLES[roleIdx % ROLES.length]

  if (!deleting && text === current) {
    deleting = true
    setTimeout(tick, 1600)
    return
  }

  if (deleting && text === '') {
    deleting = false
    roleIdx++
    setTimeout(tick, 220)
    return
  }

  text = deleting
    ? current.slice(0, text.length - 1)
    : current.slice(0, text.length + 1)

  typedEl.textContent = text

  setTimeout(tick, deleting ? 45 : 90)
}

tick()

// ============================================================
// Contact Form
// ============================================================

const form = document.getElementById('contactForm')
const submitBtn = document.getElementById('submitBtn')
const submitText = document.getElementById('submitText')
const statusEl = document.getElementById('formStatus')

// ---------- Form errors ----------
const setError = (id, msg) => {
  document.getElementById(`err-${id}`).textContent = msg || ''
}

// ---------- Form validation ----------
const validate = () => {
  const name = form.name.value.trim()
  const email = form.email.value.trim()
  const subject = form.subject.value.trim()
  const message = form.message.value.trim()

  let ok = true

  if (!name) {
    setError('name', 'Please enter your full name.')
    ok = false
  } else {
    setError('name', '')
  }

  if (!email) {
    setError('email', 'Please enter your email.')
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'Please enter a valid email.')
    ok = false
  } else {
    setError('email', '')
  }

  if (!subject) {
    setError('subject', 'Please enter a subject.')
    ok = false
  } else {
    setError('subject', '')
  }

  if (!message) {
    setError('message', 'Please enter a message.')
    ok = false
  } else if (message.length < 10) {
    setError('message', 'Message should be at least 10 characters.')
    ok = false
  } else {
    setError('message', '')
  }

  return ok
}

// ---------- Status message ----------
const showStatus = (type, msg) => {
  statusEl.className = `form-status show ${type}`
  statusEl.textContent = msg
}

// ---------- Recipient ----------
const RECIPIENT_EMAIL = 'maharana3002@gmail.com'

// ============================================================
// Send Email with EmailJS
// ============================================================

async function sendEmail(payload) {
  if (!isEmailConfigured()) {
    return {
      ok: false,
      reason: 'not-configured',
    }
  }

  const res = await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    {
      // These names match the EmailJS template
      from_name: payload.name,
      from_email: payload.email,
      subject: payload.subject,
      message: payload.message,
    }
  )

  if (res && res.status === 200) {
    return {
      ok: true,
    }
  }

  return {
    ok: false,
    reason: 'email-failed',
    detail: res,
  }
}

// ============================================================
// Supabase backup logging
// ============================================================

async function logToSupabase(payload) {
  try {
    await supabase.from('messages').insert(payload)
  } catch (_) {
    // Logging is best-effort
  }
}

// ============================================================
// Contact Form Submit
// ============================================================

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (!validate()) {
    return
  }

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  }

  submitBtn.disabled = true
  submitText.textContent = 'Sending…'

  showStatus('loading', 'Sending your message…')

  try {
    const result = await sendEmail(payload)

    // ---------- Success ----------
    if (result.ok) {
      showStatus(
        'success',
        'Message Sent Successfully! Thank you for reaching out — I will get back to you soon.'
      )

      form.reset()

      logToSupabase(payload)

      return
    }

    // ---------- EmailJS not configured ----------
    if (result.reason === 'not-configured') {
      showStatus(
        'error',
        'Email delivery is not configured yet. Please email me directly at ' +
          RECIPIENT_EMAIL +
          '.'
      )
    } else {
      // ---------- EmailJS failed ----------
      showStatus(
        'error',
        'Sorry, your message could not be delivered. Please try again or email me directly at ' +
          RECIPIENT_EMAIL +
          '.'
      )

      logToSupabase(payload)
    }
  } catch (err) {
    console.error('EmailJS Error:', err)

    showStatus(
      'error',
      'Sorry, something went wrong. Please email me directly at ' +
        RECIPIENT_EMAIL +
        '.'
    )

    logToSupabase(payload)
  } finally {
    submitBtn.disabled = false
    submitText.textContent = 'Send Message'
  }
})