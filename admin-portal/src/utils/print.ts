/**
 * Bulletproof print utility that isolates an element inside a hidden iframe
 * ensuring 0% of the surrounding web application (sidebar, navbar, controls)
 * is visible in the print preview or exported PDF.
 */
export const printElement = (elementId: string, title = 'Document') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`printElement: Element with ID "${elementId}" not found.`);
    window.print();
    return;
  }

  // Create an isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    window.print();
    return;
  }

  // Collect all active stylesheets and inline style blocks
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            padding: 8px !important;
          }
          #${elementId} {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Trigger print after iframe renders styles
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Print iframe error:', e);
      window.print();
    } finally {
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {
          // ignore
        }
      }, 2000);
    }
  }, 350);
};
