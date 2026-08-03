export function exportCSV(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${c ?? ''}"`).join(','))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export function exportExcel(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  // Generate a simple HTML table that Excel can open as .xls
  const tableRows = rows
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td>${c ?? ''}</td>`).join('')}</tr>`
    )
    .join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${headers
    .map((h) => `<th>${h}</th>`)
    .join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, filename.endsWith('.xls') ? filename : `${filename}.xls`);
}

export function exportPDF(title: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const win = window.open('', '_blank');
  if (!win) return;
  const tableRows = rows
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td style="padding:6px 10px;border:1px solid #ddd">${c ?? ''}</td>`).join('')}</tr>`
    )
    .join('');
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    body{font-family:Georgia,serif;padding:40px;color:#1a1a1a}
    h1{font-size:24px;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#c9a55c;color:#fff;padding:8px 10px;text-align:left;border:1px solid #c9a55c}
    @media print{body{padding:0}button{display:none}}
  </style></head><body>
    <h1>${title}</h1>
    <p style="font-size:12px;color:#666;margin-bottom:16px">Generated on ${new Date().toLocaleString()}</p>
    <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table>
    <script>setTimeout(()=>window.print(),500)</script>
  </body></html>`);
  win.document.close();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
