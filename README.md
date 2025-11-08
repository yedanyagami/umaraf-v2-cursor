# UMARAF v2 - Cursor AI Agent Integration Extension

<div align="center">

![UMARAF Logo](./resources/icons/umaraf-banner.png)

**整合 AutoGen、LangGraph、CrewAI、Swarm 等多種 AI Agent 框架的強大 Cursor 擴展**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yedanyagami/umaraf-v2-cursor)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

[功能特性](#-功能特性) • [安裝](#-安裝) • [使用指南](#-使用指南) • [開發](#-開發) • [貢獻](#-貢獻)

</div>

---

## 📋 概述

UMARAF v2 是一個為 Cursor IDE 設計的 AI Agent 整合擴展，提供：

- 🤖 **多框架支援**: AutoGen、LangGraph、CrewAI、Swarm
- 🎨 **視覺化工作流程編輯器**: 拖放式 AI Agent 流程設計
- 🔍 **智能代碼分析**: AI 驅動的 Code Lens 和 Hover 提示
- 🛠️ **逆向工程整合**: Frida 動態分析支援
- ⚡ **效能測試**: 內建 Benchmark 工具
- 📝 **自動化文檔生成**: AI 生成代碼文檔和測試

## ✨ 功能特性

### 1. AI Code Lens
在函數定義上方自動顯示 AI 操作按鈕：
- 🤖 AI 優化
- 📝 生成文檔
- 🧪 生成測試
- 🔍 安全審查

### 2. AI Hover Provider
滑鼠懸停時顯示智能分析：
- 類型推斷
- 用途說明
- 優化建議
- 相關文檔連結

### 3. 工作流程編輯器
視覺化設計 AI Agent 工作流程：
- 拖放式 Agent 節點
- 連接和配置 Agent
- 一鍵執行完整工作流程

### 4. Frida 逆向整合
動態分析和 Hook：
- 實時 Hook 追蹤
- AI 安全分析
- 漏洞檢測

## 🚀 安裝

### 從 VSIX 安裝

```bash
# 下載最新版本
wget https://github.com/yedanyagami/umaraf-v2-cursor/releases/latest/download/umaraf-v2-cursor.vsix

# 安裝到 Cursor
code --install-extension umaraf-v2-cursor.vsix
```

### 從源碼構建

```bash
# 克隆倉庫
git clone https://github.com/yedanyagami/umaraf-v2-cursor.git
cd umaraf-v2-cursor

# 安裝依賴
npm install

# 編譯
npm run compile

# 打包
npm run package
```

## 📖 使用指南

### 快速開始

1. **啟動擴展**: 安裝後自動激活
2. **打開工作流程編輯器**: `Ctrl+Shift+P` → "UMARAF: 打開工作流程編輯器"
3. **添加 AI Agent**: 點擊工具欄按鈕添加不同的 Agent
4. **配置和執行**: 拖動配置 Agent，點擊"執行工作流程"

### 配置選項

在 Cursor 設定中配置 UMARAF：

```json
{
  "umaraf.enableCodeLens": true,
  "umaraf.enableHoverProvider": true,
  "umaraf.defaultAgent": "autogen",
  "umaraf.apiEndpoint": "http://localhost:8000",
  "umaraf.enableFrida": false
}
```

### 命令列表

| 命令 | 描述 | 快捷鍵 |
|------|------|--------|
| `umaraf.optimizeFunction` | AI 優化函數 | - |
| `umaraf.generateDocs` | 生成文檔 | - |
| `umaraf.generateTests` | 生成測試 | - |
| `umaraf.securityAudit` | 安全審查 | - |
| `umaraf.openWorkflow` | 打開工作流程編輯器 | - |
| `umaraf.fridaAnalyze` | Frida 逆向分析 | - |
| `umaraf.benchmarkCode` | 效能測試 | - |

## 🏗️ 架構

```
umaraf-cursor-extension/
├── src/
│   ├── extension.ts           # 擴展入口
│   ├── config.ts              # 配置管理
│   ├── providers/             # VSCode Providers
│   │   ├── aiCodeLensProvider.ts
│   │   ├── aiHoverProvider.ts
│   │   └── aiCompletionProvider.ts
│   ├── features/              # 功能模組
│   │   ├── aiWorkflow.ts     # 工作流程編輯器
│   │   ├── aiReverser.ts     # 逆向工程
│   │   └── aiBenchmark.ts    # 效能測試
│   └── agents/                # AI Agent 整合
│       ├── autogen/
│       ├── langgraph/
│       ├── crewai/
│       └── swarm/
├── resources/                 # 資源文件
└── test/                     # 測試文件
```

## 🔧 開發

### 環境要求

- Node.js >= 18
- TypeScript >= 5.0
- Cursor IDE >= 1.85

### 開發設置

```bash
# 克隆項目
git clone https://github.com/yedanyagami/umaraf-v2-cursor.git
cd umaraf-v2-cursor

# 安裝依賴
npm install

# 開發模式（自動重新編譯）
npm run watch

# 運行測試
npm test

# 打包發布
npm run package
```

### 調試

1. 在 Cursor 中打開項目
2. 按 `F5` 啟動調試
3. 在新窗口中測試擴展功能

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 此倉庫
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 許可證

本項目採用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 👤 作者

**YEDAN AI System**
- Email: yagami8095@gmail.com
- GitHub: [@yedanyagami](https://github.com/yedanyagami)

## 🙏 致謝

感謝以下開源項目：
- [AutoGen](https://github.com/microsoft/autogen)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [CrewAI](https://github.com/joaomdmoura/crewAI)
- [Swarm](https://github.com/openai/swarm)
- [Frida](https://frida.re/)

## 📊 統計

![GitHub stars](https://img.shields.io/github/stars/yedanyagami/umaraf-v2-cursor?style=social)
![GitHub forks](https://img.shields.io/github/forks/yedanyagami/umaraf-v2-cursor?style=social)
![GitHub issues](https://img.shields.io/github/issues/yedanyagami/umaraf-v2-cursor)

---

<div align="center">
Made with ❤️ by YEDAN AI System
</div>

