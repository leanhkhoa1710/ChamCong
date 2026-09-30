import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\M.API\M.API.csproj"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

target = '    <Compile Remove="Controllers\\EmployeeController.cs" />\r\n'
block = "  <ItemGroup>\r\n" + target + "  </ItemGroup>\r\n"
if block in s:
    s = s.replace(block, "")
    print("OK: removed CRLF ItemGroup block")
elif target in s:
    s = s.replace(target, "")
    print("OK: removed single CRLF line")
else:
    # Fallback: LF
    target_lf = '    <Compile Remove="Controllers\\EmployeeController.cs" />\n'
    block_lf = "  <ItemGroup>\n" + target_lf + "  </ItemGroup>\n"
    if block_lf in s:
        s = s.replace(block_lf, "")
        print("OK: removed LF ItemGroup block")
    elif target_lf in s:
        s = s.replace(target_lf, "")
        print("OK: removed single LF line")
    else:
        print("NOT FOUND - line still present?")
        print('EmployeeController' in s)

with io.open(p, "w", encoding="utf-8", newline="") as f:
    f.write(s)

# Verify
with io.open(p, "r", encoding="utf-8") as f:
    check = f.read()
print("EmployeeController mention remaining:", "EmployeeController" in check)
print("DONE")
