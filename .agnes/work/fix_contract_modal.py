import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\contracts\pages\AdminContractPage.jsx"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

old = '''                            <div
                                className="att-form-modal"
                                onClick={() => setShowModal(false)}
                            >'''
new = '''                            <div
                                className="att-form-modal"
                            >'''

if old in s:
    s = s.replace(old, new)
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("OK: AdminContractPage.jsx")
else:
    print("NOT FOUND")
