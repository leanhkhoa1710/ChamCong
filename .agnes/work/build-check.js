const { execSync } = require('child_process');
try {
  const out = execSync('cd /d D:\\Monica\\M-ChamCong && dotnet build M.API\\M.API.csproj --no-restore 2>&1', { encoding: 'utf8', timeout: 120000 });
  console.log(out.substring(0, 2000));
} catch (e) {
  console.log('BUILD OUTPUT:\n' + (e.stdout || '').substring(0, 2000));
}
