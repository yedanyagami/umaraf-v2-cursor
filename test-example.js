// ========================================
// UMARAF v2 測試範例文件
// ========================================

// 這個文件用於測試 UMARAF v2 的各種功能
// 在 Cursor 中打開此文件後，您應該能看到：
// 1. 函數上方的 AI Code Lens 按鈕
// 2. 懸停時的 AI 分析提示

// === 測試 1: 基本函數（應該顯示 Code Lens）===
function calculateSum(a, b) {
    return a + b;
}

// === 測試 2: 箭頭函數 ===
const multiply = (x, y) => {
    return x * y;
};

// === 測試 3: 類方法 ===
class Calculator {
    divide(a, b) {
        if (b === 0) {
            throw new Error('Division by zero');
        }
        return a / b;
    }
    
    power(base, exponent) {
        return Math.pow(base, exponent);
    }
}

// === 測試 4: 異步函數 ===
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// === 測試 5: 帶文檔的函數 ===
/**
 * 計算數組的平均值
 * @param {number[]} numbers - 數字數組
 * @returns {number} 平均值
 */
function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

// === 測試 6: 複雜邏輯函數 ===
function findPrimes(max) {
    const primes = [];
    for (let i = 2; i <= max; i++) {
        let isPrime = true;
        for (let j = 2; j < i; j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
    }
    return primes;
}

// === 測試變數（測試 Hover Provider）===
const userName = "YEDAN AI System";
const apiEndpoint = "http://localhost:8000";
const maxRetries = 3;

// === 測試對象 ===
const config = {
    agent: "autogen",
    apiKey: "your-api-key-here",
    timeout: 30000,
    enableCache: true
};

// === 測試數組方法 ===
const data = [1, 2, 3, 4, 5];
const doubled = data.map(n => n * 2);
const filtered = data.filter(n => n > 2);
const total = data.reduce((sum, n) => sum + n, 0);

// === 使用範例 ===
console.log('UMARAF v2 測試開始...');
console.log('Sum:', calculateSum(5, 10));
console.log('Multiply:', multiply(3, 4));
console.log('Average:', calculateAverage([1, 2, 3, 4, 5]));
console.log('Primes:', findPrimes(20));

// ========================================
// 測試說明：
// 
// 1. 在 Cursor 中打開此文件
// 2. 您應該在每個函數定義上方看到 4 個按鈕：
//    - 🤖 AI 優化
//    - 📝 生成文檔
//    - 🧪 生成測試
//    - 🔍 安全審查
//
// 3. 將滑鼠懸停在變數名稱上（如 userName），
//    應該看到 UMARAF AI 分析面板
//
// 4. 打開命令面板 (Ctrl+Shift+P)，
//    輸入 "UMARAF" 查看所有可用命令
//
// 5. 打開工作流程編輯器測試 AI Agent 功能
//
// ========================================

