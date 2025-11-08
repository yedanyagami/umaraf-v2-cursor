import * as vscode from 'vscode';

export class AICodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
    
    async provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        
        // 偵測函數定義
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            
            // 檢測函數定義 (支援多種語言)
            if (this.isFunctionDefinition(line.text)) {
                const range = new vscode.Range(i, 0, i, 0);
                
                // 添加多個 AI 操作
                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: "🤖 AI 優化",
                        command: "umaraf.optimizeFunction",
                        arguments: [document.uri, range]
                    }),
                    new vscode.CodeLens(range, {
                        title: "📝 生成文檔",
                        command: "umaraf.generateDocs",
                        arguments: [document.uri, range]
                    }),
                    new vscode.CodeLens(range, {
                        title: "🧪 生成測試",
                        command: "umaraf.generateTests",
                        arguments: [document.uri, range]
                    }),
                    new vscode.CodeLens(range, {
                        title: "🔍 安全審查",
                        command: "umaraf.securityAudit",
                        arguments: [document.uri, range]
                    })
                );
            }
        }
        
        return codeLenses;
    }
    
    private isFunctionDefinition(text: string): boolean {
        const patterns = [
            /function\s+\w+\s*\(/,        // JavaScript/TypeScript
            /const\s+\w+\s*=\s*\([^)]*\)\s*=>/,  // Arrow functions
            /def\s+\w+\s*\(/,             // Python
            /public\s+\w+\s+\w+\s*\(/,    // Java/C#
            /func\s+\w+\s*\(/,            // Go
            /fn\s+\w+\s*\(/,              // Rust
            /sub\s+\w+\s*\(/i,            // VB
        ];
        
        return patterns.some(pattern => pattern.test(text));
    }
    
    public refresh(): void {
        this._onDidChangeCodeLenses.fire();
    }
}

