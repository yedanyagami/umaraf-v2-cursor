import * as vscode from 'vscode';

export class AICompletionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // AI Agent 相關的自動補全
        if (linePrefix.endsWith('ai.')) {
            return this.getAIMethodCompletions();
        }
        
        // Agent 框架自動補全
        if (linePrefix.includes('import')) {
            return this.getAgentFrameworkCompletions();
        }
        
        return [];
    }
    
    private getAIMethodCompletions(): vscode.CompletionItem[] {
        return [
            this.createCompletionItem(
                'optimize',
                '優化代碼',
                'ai.optimize(code)',
                vscode.CompletionItemKind.Method
            ),
            this.createCompletionItem(
                'analyze',
                '分析代碼',
                'ai.analyze(code)',
                vscode.CompletionItemKind.Method
            ),
            this.createCompletionItem(
                'generate',
                '生成代碼',
                'ai.generate(prompt)',
                vscode.CompletionItemKind.Method
            ),
        ];
    }
    
    private getAgentFrameworkCompletions(): vscode.CompletionItem[] {
        return [
            this.createCompletionItem(
                'autogen',
                'AutoGen Framework',
                'from autogen import Agent',
                vscode.CompletionItemKind.Module
            ),
            this.createCompletionItem(
                'langgraph',
                'LangGraph Framework',
                'from langgraph import Graph',
                vscode.CompletionItemKind.Module
            ),
            this.createCompletionItem(
                'crewai',
                'CrewAI Framework',
                'from crewai import Agent, Task, Crew',
                vscode.CompletionItemKind.Module
            ),
        ];
    }
    
    private createCompletionItem(
        label: string,
        detail: string,
        insertText: string,
        kind: vscode.CompletionItemKind
    ): vscode.CompletionItem {
        const item = new vscode.CompletionItem(label, kind);
        item.detail = detail;
        item.insertText = new vscode.SnippetString(insertText);
        item.documentation = new vscode.MarkdownString(`由 UMARAF AI 提供`);
        return item;
    }
}

