import * as vscode from 'vscode';

export class ConfigManager {
    private config: vscode.WorkspaceConfiguration;
    
    constructor() {
        this.config = vscode.workspace.getConfiguration('umaraf');
    }
    
    get<T>(key: string, defaultValue: T): T {
        return this.config.get<T>(key, defaultValue);
    }
    
    async set(key: string, value: any): Promise<void> {
        await this.config.update(key, value, vscode.ConfigurationTarget.Global);
    }
    
    get enableCodeLens(): boolean {
        return this.get('enableCodeLens', true);
    }
    
    get enableHoverProvider(): boolean {
        return this.get('enableHoverProvider', true);
    }
    
    get defaultAgent(): string {
        return this.get('defaultAgent', 'autogen');
    }
    
    get apiEndpoint(): string {
        return this.get('apiEndpoint', 'http://localhost:8000');
    }
    
    get enableFrida(): boolean {
        return this.get('enableFrida', false);
    }
}

