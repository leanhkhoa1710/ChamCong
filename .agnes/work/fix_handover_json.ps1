$f = "D:\Monica\M-ChamCong\M.API\Controllers\EmployeeHandoverController.cs"
$text = [IO.File]::ReadAllText($f, [Text.UTF8Encoding]::new($false))

# Guard: only patch if not already patched
if ($text -match 'Deserialize<List<HandoverAssetRow>>\(form\.AssetsJson, Json\)') {
    Write-Host "already patched"; exit 0
}

# Deserialization (case-insensitive bind of camelCase -> PascalCase)
$text = $text.Replace(
    'JsonSerializer.Deserialize<List<HandoverAssetRow>>(form.AssetsJson)',
    'JsonSerializer.Deserialize<List<HandoverAssetRow>>(form.AssetsJson, Json)')
$text = $text.Replace(
    'JsonSerializer.Deserialize<List<HandoverProjectRow>>(form.ProjectsJson)',
    'JsonSerializer.Deserialize<List<HandoverProjectRow>>(form.ProjectsJson, Json)')
$text = $text.Replace(
    'JsonSerializer.Deserialize<List<HandoverAttachmentInput>>(form.AttachmentMetadataJson)',
    'JsonSerializer.Deserialize<List<HandoverAttachmentInput>>(form.AttachmentMetadataJson, Json)')
$text = $text.Replace(
    'JsonSerializer.Deserialize<List<HandoverProjectRow>>(handover.ProjectsJson)',
    'JsonSerializer.Deserialize<List<HandoverProjectRow>>(handover.ProjectsJson, Json)')

# Serialization (emit camelCase so the frontend's parseJson reads it directly)
$text = $text.Replace(
    'JsonSerializer.Serialize(assets)',
    'JsonSerializer.Serialize(assets, Json)')
$text = $text.Replace(
    'JsonSerializer.Serialize(projects)',
    'JsonSerializer.Serialize(projects, Json)')

[IO.File]::WriteAllText($f, $text, [Text.UTF8Encoding]::new($false))
Write-Host "patched"
# verify
$check = [IO.File]::ReadAllText($f)
Write-Host ("Deserialize w/ Json: " + ([regex]::Matches($check, 'Deserialize<[^>]+>\([^)]*, Json\)')).Count)
Write-Host ("Serialize w/ Json:   " + ([regex]::Matches($check, 'Serialize\([a-z]+, Json\)')).Count)
