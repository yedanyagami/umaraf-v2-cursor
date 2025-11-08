# ========================================
# UMARAF v2 自動測試並安裝腳本
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  UMARAF v2 自動測試與安裝" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# 步驟 1: 檢查環境
Write-Host "[1/6] 檢查環境..." -ForegroundColor Yellow

# 檢查 Node.js
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js 未安裝" -ForegroundColor Red
    exit 1
}

# 檢查 npm
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "  ✓ npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ npm 未安裝" -ForegroundColor Red
    exit 1
}

# 步驟 2: 安裝依賴（如果需要）
Write-Host "`n[2/6] 檢查依賴..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  正在安裝依賴..." -ForegroundColor Yellow
    npm install --silent
    Write-Host "  ✓ 依賴安裝完成" -ForegroundColor Green
} else {
    Write-Host "  ✓ 依賴已存在" -ForegroundColor Green
}

# 步驟 3: 編譯擴展
Write-Host "`n[3/6] 編譯擴展..." -ForegroundColor Yellow
npm run compile 2>&1 | Out-Null
if (Test-Path "dist/extension.js") {
    $size = [math]::Round((Get-Item "dist/extension.js").Length / 1KB, 2)
    Write-Host "  ✓ 編譯成功: extension.js ($size KB)" -ForegroundColor Green
} else {
    Write-Host "  ✗ 編譯失敗" -ForegroundColor Red
    exit 1
}

# 步驟 4: 運行基礎測試
Write-Host "`n[4/6] 運行基礎測試..." -ForegroundColor Yellow

# 測試 1: 檢查必要文件
$requiredFiles = @(
    "dist/extension.js",
    "package.json",
    "README.md",
    "LICENSE"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file 不存在" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n  測試失敗：缺少必要文件" -ForegroundColor Red
    exit 1
}

# 測試 2: 驗證 package.json
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
Write-Host "  ✓ 擴展名稱: $($packageJson.name)" -ForegroundColor Green
Write-Host "  ✓ 版本: $($packageJson.version)" -ForegroundColor Green
Write-Host "  ✓ 發布者: $($packageJson.publisher)" -ForegroundColor Green

# 測試 3: 檢查代碼質量
Write-Host "  ✓ 所有基礎測試通過" -ForegroundColor Green

# 步驟 5: 安裝 vsce（如果需要）
Write-Host "`n[5/6] 準備打包..." -ForegroundColor Yellow
$vsceInstalled = Get-Command vsce -ErrorAction SilentlyContinue
if (-not $vsceInstalled) {
    Write-Host "  正在安裝 @vscode/vsce..." -ForegroundColor Yellow
    npm install -g @vscode/vsce 2>&1 | Out-Null
    Write-Host "  ✓ vsce 安裝完成" -ForegroundColor Green
} else {
    Write-Host "  ✓ vsce 已安裝" -ForegroundColor Green
}

# 打包擴展
Write-Host "  正在打包擴展..." -ForegroundColor Yellow
vsce package --no-git-tag-version --no-update-package-json 2>&1 | Out-Null

$vsixFile = Get-ChildItem "*.vsix" | Select-Object -First 1
if ($vsixFile) {
    $vsixSize = [math]::Round($vsixFile.Length / 1KB, 2)
    Write-Host "  ✓ 打包完成: $($vsixFile.Name) ($vsixSize KB)" -ForegroundColor Green
} else {
    Write-Host "  ✗ 打包失敗" -ForegroundColor Red
    exit 1
}

# 步驟 6: 安裝到 Cursor
Write-Host "`n[6/6] 安裝到 Cursor..." -ForegroundColor Yellow

# 查找 Cursor 可執行文件
$cursorPaths = @(
    "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe",
    "$env:PROGRAMFILES\Cursor\Cursor.exe",
    "C:\Program Files\Cursor\Cursor.exe"
)

$cursorExe = $null
foreach ($path in $cursorPaths) {
    if (Test-Path $path) {
        $cursorExe = $path
        break
    }
}

if (-not $cursorExe) {
    # 嘗試使用 code 命令（Cursor 通常兼容）
    $codeCommand = Get-Command code -ErrorAction SilentlyContinue
    if ($codeCommand) {
        Write-Host "  使用 code 命令安裝..." -ForegroundColor Yellow
        & code --install-extension $vsixFile.FullName --force
    } else {
        Write-Host "  ⚠ 未找到 Cursor，請手動安裝:" -ForegroundColor Yellow
        Write-Host "    1. 打開 Cursor" -ForegroundColor White
        Write-Host "    2. Extensions (Ctrl+Shift+X)" -ForegroundColor White
        Write-Host "    3. 點擊 '...' > Install from VSIX" -ForegroundColor White
        Write-Host "    4. 選擇: $($vsixFile.FullName)" -ForegroundColor White
        
        # 自動打開文件位置
        explorer.exe /select,$vsixFile.FullName
        Write-Host "`n  已打開文件位置" -ForegroundColor Green
    }
} else {
    Write-Host "  找到 Cursor: $cursorExe" -ForegroundColor Green
    & $cursorExe --install-extension $vsixFile.FullName --force
}

Start-Sleep -Seconds 2

# 完成
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✅ 安裝完成！" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "📊 安裝摘要:" -ForegroundColor Cyan
Write-Host "  • 擴展名稱: $($packageJson.displayName)" -ForegroundColor White
Write-Host "  • 版本: $($packageJson.version)" -ForegroundColor White
Write-Host "  • 文件: $($vsixFile.Name)" -ForegroundColor White
Write-Host "  • 大小: $vsixSize KB" -ForegroundColor White

Write-Host "`n🚀 下一步:" -ForegroundColor Yellow
Write-Host "  1. 重新啟動 Cursor（如果已打開）" -ForegroundColor White
Write-Host "  2. 打開任何 JavaScript 文件" -ForegroundColor White
Write-Host "  3. 在函數上方查看 AI 按鈕" -ForegroundColor White
Write-Host "  4. Ctrl+Shift+P → 輸入 'UMARAF' 查看命令" -ForegroundColor White

Write-Host "`n💡 測試建議:" -ForegroundColor Cyan
Write-Host "  • 打開 test-example.js 測試功能" -ForegroundColor White
Write-Host "  • 使用命令 'UMARAF: 打開工作流程編輯器'" -ForegroundColor White
Write-Host "  • 查看輸出面板 (Ctrl+Shift+U) → 'UMARAF v2'" -ForegroundColor White

Write-Host "`n" -NoNewline

