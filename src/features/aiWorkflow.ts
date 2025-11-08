import * as vscode from 'vscode';

export class AIWorkflowPanel {
    private panel: vscode.WebviewPanel | undefined;
    
    public show(context: vscode.ExtensionContext) {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
            return;
        }
        
        this.panel = vscode.window.createWebviewPanel(
            'umarafWorkflow',
            '🔄 UMARAF AI 工作流程',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        
        this.panel.webview.html = this.getWebviewContent();
        
        // 處理來自 webview 的訊息
        this.panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'createAgent':
                        await this.createAgent(message.data);
                        break;
                    case 'connectAgents':
                        await this.connectAgents(message.data);
                        break;
                    case 'runWorkflow':
                        await this.runWorkflow(message.data);
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
        
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }
    
    private getWebviewContent(): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UMARAF AI 工作流程</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            background: #1e1e1e;
            color: #cccccc;
        }
        
        h2 {
            margin-bottom: 20px;
            color: #007acc;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        #canvas {
            width: 100%;
            height: 500px;
            border: 2px solid #444;
            border-radius: 8px;
            background: #2d2d2d;
            position: relative;
            overflow: hidden;
        }
        
        .agent-node {
            position: absolute;
            padding: 15px 20px;
            background: linear-gradient(135deg, #3c3c3c 0%, #2d2d2d 100%);
            border: 2px solid #007acc;
            border-radius: 12px;
            cursor: move;
            min-width: 150px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .agent-node:hover {
            background: linear-gradient(135deg, #4c4c4c 0%, #3c3c3c 100%);
            box-shadow: 0 6px 12px rgba(0,122,204,0.4);
            transform: translateY(-2px);
        }
        
        .agent-node.selected {
            border-color: #28a745;
            box-shadow: 0 0 20px rgba(40,167,69,0.5);
        }
        
        .agent-icon {
            font-size: 32px;
            margin-bottom: 8px;
        }
        
        .agent-type {
            font-weight: bold;
            color: #007acc;
            margin-bottom: 4px;
        }
        
        .agent-id {
            font-size: 11px;
            color: #888;
        }
        
        .toolbar {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        button {
            padding: 10px 20px;
            background: #007acc;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        button:hover {
            background: #005a9e;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        button.success {
            background: #28a745;
        }
        
        button.success:hover {
            background: #218838;
        }
        
        button.danger {
            background: #dc3545;
        }
        
        button.danger:hover {
            background: #c82333;
        }
        
        .status-bar {
            margin-top: 20px;
            padding: 15px;
            background: #2d2d2d;
            border-radius: 8px;
            border-left: 4px solid #007acc;
        }
        
        .status-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .status-item:last-child {
            margin-bottom: 0;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .badge.success {
            background: #28a745;
            color: white;
        }
        
        .badge.warning {
            background: #ffc107;
            color: #000;
        }
        
        .badge.info {
            background: #007acc;
            color: white;
        }
    </style>
</head>
<body>
    <h2>
        <span>🔄</span>
        <span>UMARAF AI 工作流程編輯器</span>
    </h2>
    
    <div class="toolbar">
        <button onclick="addAgent('autogen')">
            <span>➕</span>
            <span>AutoGen</span>
        </button>
        <button onclick="addAgent('langgraph')">
            <span>➕</span>
            <span>LangGraph</span>
        </button>
        <button onclick="addAgent('crewai')">
            <span>➕</span>
            <span>CrewAI</span>
        </button>
        <button onclick="addAgent('swarm')">
            <span>➕</span>
            <span>Swarm</span>
        </button>
        <button onclick="clearCanvas()" class="danger">
            <span>🗑️</span>
            <span>清空</span>
        </button>
        <button onclick="runWorkflow()" class="success">
            <span>▶️</span>
            <span>執行工作流程</span>
        </button>
    </div>
    
    <div id="canvas"></div>
    
    <div class="status-bar">
        <div class="status-item">
            <span>📊 Agent 數量:</span>
            <span class="badge info" id="agentCount">0</span>
        </div>
        <div class="status-item">
            <span>🔗 連接數量:</span>
            <span class="badge warning" id="connectionCount">0</span>
        </div>
        <div class="status-item">
            <span>⚡ 狀態:</span>
            <span class="badge success" id="status">就緒</span>
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        let agents = [];
        let connections = [];
        
        function updateStatus() {
            document.getElementById('agentCount').textContent = agents.length;
            document.getElementById('connectionCount').textContent = connections.length;
        }
        
        function addAgent(type) {
            const icons = {
                'autogen': '🤖',
                'langgraph': '🕸️',
                'crewai': '👥',
                'swarm': '🐝'
            };
            
            const agent = {
                id: Date.now(),
                type: type,
                icon: icons[type] || '🤖',
                x: Math.random() * 400 + 50,
                y: Math.random() * 300 + 50
            };
            
            agents.push(agent);
            renderAgent(agent);
            updateStatus();
            
            vscode.postMessage({
                command: 'createAgent',
                data: agent
            });
        }
        
        function renderAgent(agent) {
            const node = document.createElement('div');
            node.className = 'agent-node';
            node.id = 'agent-' + agent.id;
            node.style.left = agent.x + 'px';
            node.style.top = agent.y + 'px';
            node.innerHTML = \`
                <div class="agent-icon">\${agent.icon}</div>
                <div class="agent-type">\${agent.type}</div>
                <div class="agent-id">ID: \${agent.id}</div>
            \`;
            
            document.getElementById('canvas').appendChild(node);
            makeDraggable(node, agent);
        }
        
        function makeDraggable(element, agent) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            element.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                
                // 選中此 agent
                document.querySelectorAll('.agent-node').forEach(n => n.classList.remove('selected'));
                element.classList.add('selected');
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                const newTop = element.offsetTop - pos2;
                const newLeft = element.offsetLeft - pos1;
                
                element.style.top = newTop + "px";
                element.style.left = newLeft + "px";
                
                // 更新 agent 位置
                agent.x = newLeft;
                agent.y = newTop;
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        
        function clearCanvas() {
            if (confirm('確定要清空所有 Agent 嗎？')) {
                agents = [];
                connections = [];
                document.getElementById('canvas').innerHTML = '';
                updateStatus();
            }
        }
        
        function runWorkflow() {
            document.getElementById('status').textContent = '執行中...';
            document.getElementById('status').className = 'badge warning';
            
            vscode.postMessage({
                command: 'runWorkflow',
                data: { agents, connections }
            });
            
            setTimeout(() => {
                document.getElementById('status').textContent = '完成';
                document.getElementById('status').className = 'badge success';
                
                setTimeout(() => {
                    document.getElementById('status').textContent = '就緒';
                    document.getElementById('status').className = 'badge info';
                }, 2000);
            }, 1000);
        }
        
        // 初始化
        updateStatus();
    </script>
</body>
</html>
        `;
    }
    
    private async createAgent(data: any) {
        vscode.window.showInformationMessage(
            `✅ 已創建 ${data.type} Agent (ID: ${data.id})`
        );
    }
    
    private async connectAgents(data: any) {
        vscode.window.showInformationMessage('🔗 Agent 連接功能開發中...');
    }
    
    private async runWorkflow(data: any) {
        const output = vscode.window.createOutputChannel('UMARAF Workflow');
        output.show();
        output.appendLine('🚀 開始執行 AI 工作流程...');
        output.appendLine(`📊 共有 ${data.agents.length} 個 Agent`);
        output.appendLine('');
        
        for (const agent of data.agents) {
            output.appendLine(`\n執行 ${agent.type} Agent (ID: ${agent.id})...`);
            output.appendLine(`  位置: (${agent.x}, ${agent.y})`);
            output.appendLine(`  圖標: ${agent.icon}`);
            
            // 模擬執行延遲
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        output.appendLine('\n✅ 工作流程執行完成！');
        
        vscode.window.showInformationMessage(
            `✅ 工作流程執行完成！共執行 ${data.agents.length} 個 Agent`
        );
    }
}

