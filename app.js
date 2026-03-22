(function() {

  // Privacy modal
  ['openPrivacy','openPrivacy2','openPrivacy3'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('privacyModal').classList.add('open');
      });
    }
  });

  document.getElementById('closePrivacy').addEventListener('click', function() {
    document.getElementById('privacyModal').classList.remove('open');
  });

  document.getElementById('privacyModal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });

  // Form submission
  document.getElementById('waitlistForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    var name      = document.getElementById('name').value.trim();
    var email     = document.getElementById('email').value.trim();
    var role      = document.getElementById('role').value;
    var platforms = document.getElementById('platforms').value;
    var cc        = document.getElementById('consentContact').checked;
    var cp        = document.getElementById('consentPrivacy').checked;

    // Hide all errors and messages
    document.querySelectorAll('.field-error').forEach(function(el) {
      el.style.display = 'none';
    });
    document.getElementById('successMsg').style.display = 'none';
    document.getElementById('errorMsg').style.display   = 'none';

    // Validate
    var valid = true;

    if (!name) {
      document.getElementById('nameError').style.display = 'block';
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('emailError').style.display = 'block';
      valid = false;
    }
    if (!role) {
      document.getElementById('roleError').style.display = 'block';
      valid = false;
    }
    if (!platforms) {
      document.getElementById('platformsError').style.display = 'block';
      valid = false;
    }
    if (!cc || !cp) {
      document.getElementById('consentError').style.display = 'block';
      valid = false;
    }

    if (!valid) return;

    var btn = document.getElementById('submitBtn');
    btn.disabled    = true;
    btn.textContent = 'Submitting...';

    try {
      var res = await fetch('https://formspree.io/f/mojkojye', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json'
        },
        body: JSON.stringify({
          name:                 name,
          email:                email,
          role:                 role,
          primary_platform:     platforms,
          consent_to_contact:   true,
          consent_to_privacy:   true,
          submitted_at:         new Date().toISOString(),
          source:               'waitlist-page'
        })
      });

      if (res.ok) {
        // Hide the entire form card content, show success
        document.getElementById('waitlistForm').style.display    = 'none';
        var successEl = document.getElementById('successMsg');
        successEl.style.display = 'block';
        successEl.style.marginTop = '0';
        // GA4
        if (typeof gtag !== 'undefined') {
          gtag('event', 'waitlist_signup', {
            event_category: 'lead',
            event_label:    'waitlist_form',
            role:           role,
            platform:       platforms
          });
        }
      } else {
        throw new Error('Server error ' + res.status);
      }
    } catch (err) {
      btn.disabled    = false;
      btn.textContent = 'Join the waitlist';
      document.getElementById('errorMsg').style.display = 'block';
    }
  });

})();
