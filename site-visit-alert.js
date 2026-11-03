(function () {
  const ADMIN_ALERT_URL = 'https://antonias.tashpreston2002.workers.dev';

  function sendVisitAlert() {
    const payload = {
      page: window.location.pathname || '/',
      referrer: document.referrer || 'Direct / unknown',
      userAgent: navigator.userAgent,
      city: 'Not provided',
      country: 'Not provided',
      sessionKey: 'live-session-' + Date.now()
    };

    fetch(ADMIN_ALERT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch((error) => {
      console.warn('Visit alert failed:', error);
    });
  }

  sendVisitAlert();
})();
