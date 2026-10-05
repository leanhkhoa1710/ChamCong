const fs = require('fs');
const file = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c = fs.readFileSync(file, 'utf8');
const useCRLF = c.includes('\r\n');
const nl = useCRLF ? '\r\n' : '\n';

const oldBlock = [
  '                        {/* Thanh tìm kiếm + tạo + tải lại */}',
  '                        <div className="admin-toolbar">',
  '                            <input',
  '                                type="search"',
  '                                placeholder="🔍 Tìm tên, mã NV..."',
  '                                value={search}',
  '                                onChange={(e) => setSearch(e.target.value)}',
  '                                style={{ width: 240 }}',
  '                            />',
].join(nl);

const newBlock = [
  '                        {/* Thanh tìm kiếm + tạo + tải lại */}',
  '                        <div className="admin-toolbar contract-toolbar">',
  '                            <div className="admin-search">',
  '                                <span>⌕</span>',
  '                                <input',
  '                                    type="search"',
  '                                    placeholder="Tìm tên, mã NV..."',
  '                                    value={search}',
  '                                    onChange={(e) => setSearch(e.target.value)}',
  '                                    aria-label="Tìm nhân viên"',
  '                                />',
  '                            </div>',
].join(nl);

if (!c.includes(oldBlock)) {
  console.log('OLD NOT FOUND — trying to locate');
  const lines = c.split(nl);
  lines.forEach((l, i) => { if (l.includes('type="search"') || l.includes('admin-toolbar') || l.includes('Tìm tên')) console.log((i+1)+': '+l); });
} else {
  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(file, c, 'utf8');
  console.log('OK: replaced search bar with .admin-search wrapper (CRLF=' + useCRLF + ')');
}
