/* Lead form: submits Netlify Forms with fetch and shows the success text in place.
   Without JS the form still posts and Netlify shows its own confirmation page. */
(function () {
  document.querySelectorAll('form.lead-form').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = f.querySelector('.lead-status');
      var btn = f.querySelector('[type=submit]');
      btn.disabled = true;
      status.textContent = '';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(f)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        f.reset();
        f.classList.add('is-sent');
        status.textContent = f.getAttribute('data-success');
      }).catch(function () {
        status.textContent = f.getAttribute('data-error');
        btn.disabled = false;
      });
    });
  });
})();
