import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, "../../../logs");
const logFile = path.join(logDir, "server.log");
const systemLogFile = path.join(logDir, "sys.log");

if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive:true });
}

// 로그 기록
export function addLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}]${message}\n`;

    fs.appendFile(logFile, logMessage, (err) => err?console.error('로그 기록 실패:', err):null);
}

// 메트릭 수집
export function collectMetric() {
    const secPerSend = 10;

    setInterval(() => {
        const cpuUsage = os.loadavg()[0];
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        const message = `CPU 사용량: ${cpuUsage}, 메모리 사용량: ${memoryUsage.toFixed(3)} MB`;
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}]${message}\n`;
    
        fs.appendFile(systemLogFile, logMessage, (err) => err?console.error('시스템 로그 기록 실패:', err):null);
    }, secPerSend * 1000);
}