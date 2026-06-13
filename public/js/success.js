/* ==========================================================================
   Post-checkout success page: confirms payment status and offers download.
   ========================================================================== */

(function () {
  requireAuth();

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('project');

  const statusIcon = document.getElementById('statusIcon');
  const statusTitle = document.getElementById('statusTitle');
  const statusSubtitle = document.getElementById('statusSubtitle');
  const actions = document.getElementById('actions');
  const toast = document.getElementById('toast');

  let project = null;

  async function init() {
    if (!projectId) {
      showError('Missing project reference.');
      return;
    }
    poll(0);
  }

  async function poll(attempt) {
    try {
      const status = await apiFetch(`/payments/status/${projectId}`);
      project = status.project;
      if (status.paid) {
        showSuccess();
        return;
      }
      if (attempt < 6) {
        setTimeout(() => poll(attempt + 1), 1500);
      } else {
        showPending();
      }
    } catch (e) {
      showError(e.message);
    }
  }

  function showSuccess() {
    statusIcon.textContent = '✅';
    statusTitle.textContent = 'Payment successful!';
    statusSubtitle.textContent = `"${project.name}" is unlocked. Download your website below.`;
    actions.innerHTML = `
      <button class="btn btn-primary btn-block" id="downloadBtn" type="button">Download HTML</button>
      <a class="btn btn-secondary btn-block" href="/builder.html?project=${projectId}">Back to editor</a>
      <a class="btn btn-ghost btn-block" href="/dashboard.html">Go to dashboard</a>
    `;
    document.getElementById('downloadBtn').addEventListener('click', async () => {
      try {
        const { project: fullProject } = await apiFetch(`/projects/${projectId}`);
        await downloadSiteHTML(fullProject);
      } catch (e) {
        showToast('Download failed: ' + e.message);
      }
    });
  }

  function showPending() {
    statusIcon.textContent = '⏳';
    statusTitle.textContent = 'Almost there…';
    statusSubtitle.textContent = "We're still confirming your payment with Stripe. This can take a few seconds.";
    actions.innerHTML = `
      <button class="btn btn-primary btn-block" id="retryBtn" type="button">Check again</button>
      <a class="btn btn-secondary btn-block" href="/builder.html?project=${projectId}">Back to editor</a>
    `;
    document.getElementById('retryBtn').addEventListener('click', () => {
      statusIcon.textContent = '⏳';
      statusTitle.textContent = 'Confirming your payment…';
      statusSubtitle.textContent = 'Hang tight, this only takes a moment.';
      poll(0);
    });
  }

  function showError(msg) {
    statusIcon.textContent = '⚠️';
    statusTitle.textContent = 'Something went wrong';
    statusSubtitle.textContent = msg;
    actions.innerHTML = `<a class="btn btn-secondary btn-block" href="/dashboard.html">Go to dashboard</a>`;
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  init();
})();
