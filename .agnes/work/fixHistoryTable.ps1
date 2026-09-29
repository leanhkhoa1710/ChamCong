$f = "D:\Monica\M-ChamCong\ChamCong\src\modules\attendance\components\HistoryTable.jsx"
$text = [IO.File]::ReadAllText($f, [Text.UTF8Encoding]::new($false))

# 1) add import of shared PhotoCell after the formatVnTime import line
$importLine = 'import { formatVnTime } from "../../../utils/vnTime";'
$importAdd = $importLine + "`n`n" + 'import PhotoCell from "./PhotoCell";'
if (-not $text.Contains('import PhotoCell from "./PhotoCell";')) {
    $text = $text.Replace($importLine, $importAdd)
}

# 2) remove the inline PhotoCell block (from the comment line to its closing ");")
$blockStart = '// 1 ô ảnh: thumbnail (nếu có) + badge Có/Không.'
$blockEnd = ');`n`n' 
# Find start index
$i = $text.IndexOf($blockStart)
if ($i -ge 0) {
    # The block ends at the next ");" line. Find the substring from start up to the first 'PhotoCell = ({ src, alt }) => (' block end:
    # locate the end marker: the '});' + newline that closes the const PhotoCell
    $marker = '    );'
    # Simpler: capture from $i to the first occurrence of 'const HistoryTable'
    $j = $text.IndexOf('const HistoryTable')
    if ($j -gt $i) {
        $text = $text.Remove($i, $j - $i)
    }
}

[IO.File]::WriteAllText($f, $text, [Text.UTF8Encoding]::new($false))
Write-Host "done"
Write-Host "inline PhotoCell still present: " + ($text.Contains('const PhotoCell = ({ src, alt }) =>'))
Write-Host "import present: " + ($text.Contains('import PhotoCell from "./PhotoCell";'))
