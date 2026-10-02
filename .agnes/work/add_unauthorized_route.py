import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\App.jsx"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

# 1) import UnauthorizedPage
old1 = 'import HomePage from "./modules/home/pages/HomePage";\r\nimport RequireModule from "./components/common/RequireModule";'
new1 = 'import HomePage from "./modules/home/pages/HomePage";\r\nimport UnauthorizedPage from "./modules/unauthorized/pages/UnauthorizedPage";\r\nimport RequireModule from "./components/common/RequireModule";'
if old1 in s:
    s = s.replace(old1, new1)
    print("OK import (CRLF)")
elif 'import HomePage from "./modules/home/pages/HomePage";\nimport RequireModule from "./components/common/RequireModule";' in s:
    s = s.replace('import HomePage from "./modules/home/pages/HomePage";\nimport RequireModule from "./components/common/RequireModule";',
                  'import HomePage from "./modules/home/pages/HomePage";\nimport UnauthorizedPage from "./modules/unauthorized/pages/UnauthorizedPage";\nimport RequireModule from "./components/common/RequireModule";')
    print("OK import (LF)")
else:
    print("NOT FOUND import")

# 2) route /unauthorized (công khai, phía sau /kich-hoat)
old2 = '<Route path="/kich-hoat" element={<ActivatePage />} />\r\n                <Route path="/" element={<Navigate to="/home" replace />} />'
new2 = '<Route path="/kich-hoat" element={<ActivatePage />} />\r\n                <Route path="/unauthorized" element={<UnauthorizedPage />} />\r\n                <Route path="/" element={<Navigate to="/home" replace />} />'
if old2 in s:
    s = s.replace(old2, new2)
    print("OK route (CRLF)")
elif '<Route path="/kich-hoat" element={<ActivatePage />} />\n                <Route path="/" element={<Navigate to="/home" replace />} />' in s:
    s = s.replace('<Route path="/kich-hoat" element={<ActivatePage />} />\n                <Route path="/" element={<Navigate to="/home" replace />} />',
                  '<Route path="/kich-hoat" element={<ActivatePage />} />\n                <Route path="/unauthorized" element={<UnauthorizedPage />} />\n                <Route path="/" element={<Navigate to="/home" replace />} />')
    print("OK route (LF)")
else:
    print("NOT FOUND route")

with io.open(p, "w", encoding="utf-8", newline="") as f:
    f.write(s)
print("DONE")
