import * as vscode from 'vscode';

export class AIHoverProvider implements vscode.HoverProvider {
    private cache = new Map<string, vscode.Hover>();
    
    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | null> {
        const word = document.getText(
            document.getWordRangeAtPosition(position)
        );
        
        if (!word) {
            return null;
        }
        
        // 檢查快取
        const cacheKey = `${document.uri}:${position.line}:${word}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        // 使用 AI 分析
        const analysis = await this.analyzeWithAI(word, document, position);
        
        const markdown = new vscode.MarkdownString();
        markdown.supportHtml = true;
        markdown.isTrusted = true;
        markdown.appendMarkdown(`### 🤖 UMARAF AI 分析\n\n${analysis}`);
        
        const hover = new vscode.Hover(markdown);
        
        this.cache.set(cacheKey, hover);
        
        // 快取過期（5分鐘）
        setTimeout(() => {
            this.cache.delete(cacheKey);
        }, 5 * 60 * 1000);
        
        return hover;
    }
    
    private async analyzeWithAI(
        word: string,
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<string> {
        // 根據上下文選擇合適的 AI Agent
        const context = this.getContext(document, position);
        const languageId = document.languageId;
        
        // 基本分析（未來可以接入真實的 AI API）
        return `
**符號**: \`${word}\`

**語言**: ${languageId}

**類型推斷**: 分析中...

**用途**: 此符號可能用於...

**優化建議**: 
- 考慮添加類型註解
- 檢查是否可以使用 const
- 評估變數命名是否清晰

**相關文檔**: [查看文檔](https://developer.mozilla.org)

---
*由 UMARAF AI 提供支援*
        `;
    }
    
    private getContext(
        document: vscode.TextDocument,
        position: vscode.Position
    ): string {
        // 獲取周圍 10 行的上下文
        const start = Math.max(0, position.line - 5);
        const end = Math.min(document.lineCount, position.line + 5);
        
        return document.getText(
            new vscode.Range(start, 0, end, 0)
        );
    }
}

