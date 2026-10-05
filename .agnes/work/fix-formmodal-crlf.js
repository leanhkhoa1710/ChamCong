const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/components/AttendanceFormModal.jsx';
let c = fs.readFileSync(f, 'utf8');
let applied = 0;
const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } };

// options (with \r\n in between)
c = c.replace(/<option key=\{o\.l\} value=\{o\.v\}>[\r\n\s]*\{o\.l\}[\r\n\s]*<\/option>/g,
  '<option key={o.l} value={o.v}>\n                                        {L(o.l)}\n                                    </option>');
c = c.replace(/<option key=\{o\.v\} value=\{o\.v\}>[\r\n\s]*\{o\.l\}[\r\n\s]*<\/option>/g,
  '<option key={o.v} value={o.v}>\n                                        {L(o.l)}\n                                    </option>');

// labels
w('<label>\r\n                        Nhân viên\r\n', '<label>\r\n                        {L("Nhân viên")}\r\n');
w('<label>\r\n                            Ngày\r\n', '<label>\r\n                            {L("Ngày")}\r\n');
w('<label>\r\n                            Trạng thái\r\n', '<label>\r\n                            {L("Trạng thái")}\r\n');
w('Giờ thực tế\r\n                            <input', '{L("Giờ thực tế")}\r\n                            <input');
w('Phê duyệt\r\n                            <select', '{L("Phê duyệt")}\r\n                            <select');
w('<label>\r\n                        Ghi chú\r\n', '<label>\r\n                        {L("Ghi chú")}\r\n');
w('Hủy\r\n                        </button>', '{L("Hủy")}\r\n                        </button>');

fs.writeFileSync(f, c, 'utf8');
console.log('FormModal: ' + applied + ' replacements + 2 regex');
