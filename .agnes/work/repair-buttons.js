const fs = require('fs');

// AttendanceHistoryPage: "+ Thêm" and the standalone "Duyệt" button
const f1 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c1 = fs.readFileSync(f1, 'utf8');
const nl1 = c1.includes('\r\n') ? '\r\n' : '\n';
let a1 = 0;
function w1(find, repl) { if (c1.includes(find)) { c1 = c1.split(find).join(repl); a1++; } }
// "+ Thêm" button (36 spaces before text, then </button> with 32 spaces)
w1('' + '                                    + Thêm' + nl1 + '                                </button>',
   '' + '                                    {L("+ Thêm")}' + nl1 + '                                </button>');
// standalone "Duyệt" approve button (72 spaces)
w1('' + '                                                                        Duyệt' + nl1 + '                                                                    </button>',
   '' + '                                                                        {L("Duyệt")}' + nl1 + '                                                                    </button>');
fs.writeFileSync(f1, c1, 'utf8');
console.log('history: ' + a1 + ' fixed');

// StatisticsPage: "+ Thêm bản ghi", "Chi tiết", "Sửa"
const f2 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeStatisticsPage.jsx';
let c2 = fs.readFileSync(f2, 'utf8');
const nl2 = c2.includes('\r\n') ? '\r\n' : '\n';
let a2 = 0;
function w2(find, repl) { if (c2.includes(find)) { c2 = c2.split(find).join(repl); a2++; } }
// "+ Thêm bản ghi" button
w2('' + '                                    + Thêm bản ghi' + nl2 + '                                </button>',
   '' + '                                    {L("+ Thêm bản ghi")}' + nl2 + '                                </button>');
// "Chi tiết" button (68 spaces)
w2('' + '                                                                    Chi tiết' + nl2 + '                                                                </button>',
   '' + '                                                                    {L("Chi tiết")}' + nl2 + '                                                                </button>');
// "Sửa" button (68 spaces)
w2('' + '                                                                    Sửa' + nl2 + '                                                                </button>',
   '' + '                                                                    {L("Sửa")}' + nl2 + '                                                                </button>');
fs.writeFileSync(f2, c2, 'utf8');
console.log('statistics: ' + a2 + ' fixed');
