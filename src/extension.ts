import * as vscode from 'vscode';
import { AICodeLensProvider } from './providers/aiCodeLensProvider';
import { AIHoverProvider } from './providers/aiHoverProvider';
import { AICompletionProvider } from './providers/aiCompletionProvider';
import { AIWorkflowPanel } from './features/aiWorkflow';
import { AIReverserIntegration } from './features/aiReverser';
import { AIBenchmark } from './features/aiBenchmark';
import { ConfigManager } from './config';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 UMARAF v2 Cursor Extension is now active!');
    
    // 創建輸出通道
    outputChannel = vscode.window.createOutputChannel('UMARAF v2');
    outputChannel.appendLine('✅ UMARAF v2 已啟動');
    
    // 初始化配置管理器
    const config = new ConfigManager();
    
    // 註冊 Code Lens Provider
    if (config.get('enableCodeLens', true)) {
        const codeLensProvider = new AICodeLensProvider();
        context.subscriptions.push(
            vscode.languages.registerCodeLensProvider(
                { scheme: 'file' },
                codeLensProvider
            )
        );
        outputChannel.appendLine('✅ Code Lens Provider 已註冊');
    }
    
    // 註冊 Hover Provider
    if (config.get('enableHoverProvider', true)) {
        const hoverProvider = new AIHoverProvider();
        context.subscriptions.push(
            vscode.languages.registerHoverProvider(
                { scheme: 'file' },
                hoverProvider
            )
        );
        outputChannel.appendLine('✅ Hover Provider 已註冊');
    }
    
    // 註冊 Completion Provider
    const completionProvider = new AICompletionProvider();
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'file' },
            completionProvider,
            '.', '(', '"', "'"
        )
    );
    
    // 註冊命令
    registerCommands(context, config);
    
    // 顯示歡迎訊息
    vscode.window.showInformationMessage(
        '🤖 UMARAF v2 已啟動！AI Agent 整合已就緒。',
        '打開工作流程編輯器',
        '查看文檔'
    ).then(selection => {
        if (selection === '打開工作流程編輯器') {
            vscode.commands.executeCommand('umaraf.openWorkflow');
        } else if (selection === '查看文檔') {
            vscode.env.openExternal(
                vscode.Uri.parse('https://github.com/yedanyagami/umaraf-v2-cursor')
            );
        }
    });
}

function registerCommands(context: vscode.ExtensionContext, config: ConfigManager) {
    // AI 優化函數
    context.subscriptions.push(
        vscode.commands.registerCommand('umaraf.optimizeFunction', async (uri, range) => {
            outputChannel.show();
            outputChannel.appendLine('\n🔧 開始 AI 優化函數...');
            
            const document = await vscode.workspace.openTextDocument(uri);
            const functionCode = document.getText(range);
            
            outputChannel.appendLine(`📝 函數內容:\n${functionCode}`);
            outputChannel.appendLine('\n🤖 使用 AI Agent 進行優化...');
            
            // TODO: 調用 AI Agent API
            vscode.window.showInformationMessage('AI 優化功能開發中...');
        })
    );
    
    // 生成文檔
    context.subscriptions.push(
        vscode.commands.registerCommand('umaraf.generateDocs', async (uri, range) => {
            outputChannel.show();
            outputChannel.appendLine('\n📝 生成文檔...');
            vscode.window.showInformationMessage('文檔生成功能開發中...');
        })
    );
    
    // 生成測試
    context.subscriptions.push(
        vscode.commands.registerCommand('umaraf.generateTests', async (uri, range) => {
            outputChannel.show();
            outputChannel.appendLine('\n🧪 生成測試...');
            vscode.window.showInformationMessage('測試生成功能開發中...');
        })
    );
    
    // 安全審查
    context.subscriptions.push(
        vscode.commands.registerCommand('umaraf.securityAudit', async (uri, range) => {
            outputChannel.show();
            outputChannel.appendLine('\n🔍 執行安全審查...');
            vscode.window.showInformationMessage('安全審查功能開發中...');
        })
    );
    
    // 打開工作流程編輯器
    context.subscriptions.push(
        vscode.commands.registerCommand('umaraf.openWorkflow', () => {
            const workflowPanel = new AIWorkflowPanel();
            workflowPanel.show(context);
        })
    );
    
    // Frida 逆向分析
    if (config.get('enableFrida', false)) {
        context.subscriptions.push(
            vscode.commands.registerCommand('umaraf.fridaAnalyze', async () => {
                const targetPath = await vscode.window.showInputBox({
                    prompt: '輸入目標程式路徑',
                    placeHolder: '/path/to/target'
                });
                
                if (targetPath) {
                    const reverser = new AIReverserIntegration();
                    await reverser.analyzeWithFrida(targetPath);
                }
            })
        );
    }
    
    // 效能測試
    context.subscriptions.push(
        vscode.commands.registerCommand('umaraf.benchmarkCode', async () => {
            const benchmark = new AIBenchmark();
            await benchmark.run();
        })
    );
}

export function deactivate() {
    outputChannel.appendLine('👋 UMARAF v2 已停用');
    outputChannel.dispose();
}

