const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let ok = 0;

// Add hrMode to the pages that switch layout based on hrMode
// These will now render with HrAppLayout (the full HR admin sidebar)
const fixes = [
  // attendance-history
  ['<Route path="/admin/employees/attendance-history" element={guarded("/admin/employees/attendance-history", <AdminAttendanceHistoryPage />)} />',
   '<Route path="/admin/employees/attendance-history" element={guarded("/admin/employees/attendance-history", <AdminAttendanceHistoryPage hrMode />)} />'],
  // statistics
  ['<Route path="/admin/employees/statistics" element={guarded("/admin/employees/statistics", <AdminStatisticsPage />)} />',
   '<Route path="/admin/employees/statistics" element={guarded("/admin/employees/statistics", <AdminStatisticsPage hrMode />)} />'],
  // accounts
  ['<Route path="/admin/employees/accounts" element={guarded("/admin/employees/accounts", <AdminAccountIssuancePage />)} />',
   '<Route path="/admin/employees/accounts" element={guarded("/admin/employees/accounts", <AdminAccountIssuancePage hrMode />)} />'],
  // contracts
  ['<Route path="/admin/employees/contracts" element={guarded("/admin/employees/contracts", <AdminContractPage />)} />',
   '<Route path="/admin/employees/contracts" element={guarded("/admin/employees/contracts", <AdminContractPage hrMode />)} />'],
  // leaves
  ['<Route path="/admin/employees/leaves" element={guarded("/admin/employees/leaves", <AdminLeaveAdminPage />)} />',
   '<Route path="/admin/employees/leaves" element={guarded("/admin/employees/leaves", <AdminLeaveAdminPage hrMode />)} />'],
];

for (const [find, repl] of fixes) {
  if (c.includes(find)) { c = c.replace(find, repl); ok++; }
  else { console.log('MISS: ' + find.substring(0, 60)); }
}

fs.writeFileSync(f, c, 'utf8');
console.log('App.jsx: ' + ok + '/' + fixes.length + ' routes updated with hrMode');
