/**
 * generateMembersPDF
 * Generates a professional PDF for a group's member list using only browser APIs.
 * No external library needed — uses window.print() with a styled iframe.
 */
export function generateMembersPDF(group, members) {
  const now     = new Date().toLocaleDateString('en-PK', { day:'2-digit', month:'long', year:'numeric' })
  const deptMap = { SE:'Software Engineering', CS:'Computer Science' }
  const dept    = deptMap[group.department] || group.department

  const rows = members.map((m, i) => {
    const name  = m.user?.name || '—'
    const roll  = m.user?.roll_number || '—'
    const email = m.user?.email || '—'
    const role  = m.role === 'leader' ? 'Group Leader' : 'Member'
    const joined= m.joined_at ? new Date(m.joined_at).toLocaleDateString('en-PK') : '—'
    const rowBg = i % 2 === 0 ? '#f8f9fb' : '#ffffff'
    return `
      <tr style="background:${rowBg}">
        <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;font-size:12px;color:#374151;font-weight:600">${i+1}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0">
          <div style="font-size:12px;font-weight:700;color:#111827">${name}</div>
          <div style="font-size:10px;color:#6366f1;font-family:monospace;margin-top:1px">${roll}</div>
        </td>
        <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;font-size:11px;color:#6b7280">${email}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;text-align:center">
          <span style="display:inline-block;padding:2px 10px;border-radius:6px;font-size:10px;font-weight:700;
            background:${m.role==='leader'?'#fef3c7':'#ede9fe'};
            color:${m.role==='leader'?'#92400e':'#4338ca'};
            border:1px solid ${m.role==='leader'?'#fde68a':'#c4b5fd'}">
            ${role}
          </span>
        </td>
        <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;font-size:11px;color:#6b7280;text-align:center">${joined}</td>
      </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${group.name} — Members List</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#111; }
    @page { margin: 20mm 15mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:28px 32px;color:#fff;position:relative;overflow:hidden">
    <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;background:rgba(255,255,255,0.06);border-radius:50%"></div>
    <div style="position:absolute;bottom:-30px;right:80px;width:80px;height:80px;background:rgba(255,255,255,0.04);border-radius:50%"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <span style="font-size:18px;font-weight:800;letter-spacing:-0.3px">UniGroups</span>
        </div>
        <h1 style="font-size:22px;font-weight:800;margin-bottom:4px;letter-spacing:-0.5px">${group.name}</h1>
        <p style="font-size:12px;opacity:0.85">${dept} &nbsp;·&nbsp; Superior University</p>
      </div>
      <div style="text-align:right;font-size:11px;opacity:0.8">
        <p style="margin-bottom:3px">Generated: ${now}</p>
        <p>${members.length} Member${members.length!==1?'s':''}</p>
      </div>
    </div>
  </div>

  <!-- Info strip -->
  <div style="display:flex;gap:0;border-bottom:2px solid #e8eaf0">
    ${[
      ['Department', dept],
      ['Status', group.status === 'open' ? 'Open' : 'Locked'],
      ['Members', `${members.length} / ${group.max_members}`],
      ['Created', group.created_at ? new Date(group.created_at).toLocaleDateString('en-PK') : '—'],
    ].map(([l,v]) => `
      <div style="flex:1;padding:12px 20px;border-right:1px solid #e8eaf0">
        <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:3px">${l}</p>
        <p style="font-size:13px;font-weight:700;color:#111827">${v}</p>
      </div>`).join('')}
  </div>

  <!-- Table -->
  <div style="padding:20px 0">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f1f3f9">
          <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;border-bottom:2px solid #e8eaf0">#</th>
          <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;border-bottom:2px solid #e8eaf0">Student</th>
          <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;border-bottom:2px solid #e8eaf0">Email</th>
          <th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;border-bottom:2px solid #e8eaf0">Role</th>
          <th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;border-bottom:2px solid #e8eaf0">Joined</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <!-- Footer -->
  <div style="margin-top:auto;padding:16px 32px;border-top:2px solid #e8eaf0;display:flex;justify-content:space-between;align-items:center">
    <div>
      <p style="font-size:10px;font-weight:700;color:#4f46e5">UniGroups — Superior University</p>
      <p style="font-size:9px;color:#9ca3af;margin-top:2px">Group Management System · Confidential</p>
    </div>
    <p style="font-size:9px;color:#9ca3af">This document was generated on ${now}</p>
  </div>
</body>
</html>`

  // Open print dialog in a new window
  const win = window.open('', '_blank', 'width=900,height=700')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print() }, 500)
}
