# PowerShell script to REMOVE all [BsonRepresentation(BsonType.ObjectId)] lines

$modelsPath = "C:\Users\ADMIN\Desktop\nhan\nhanapp\backend\ECommerceAI\Models"

# Get all .cs files
$files = Get-ChildItem -Path $modelsPath -Filter "*_model.cs" -Recurse

Write-Host "Found $($files.Count) model files" -ForegroundColor Cyan
$totalFilesModified = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Remove lines containing [BsonRepresentation(BsonType.ObjectId)]
    $newContent = ($content -split "`r?`n") | Where-Object { 
        $_ -notmatch '\[BsonRepresentation\(BsonType\.ObjectId\)\]' 
    } | Join-String -Separator "`r`n"
    
    if ($newContent -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "✅ Removed BsonRepresentation from: $($file.Name)" -ForegroundColor Green
        $totalFilesModified++
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Summary: Files modified: $totalFilesModified" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Yellow
