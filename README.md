# 🎯 CoinToss Project

BNB Chain 기반 코인토스 베팅 게임

## 다음 단계

1. **코드 복사하기**
   - VS Code로 프로젝트 열기
   - 각 파일에 아티팩트 코드 복사

2. **패키지 설치**
   ```bash
   cd contracts && npm install
   cd ../backend && npm install
   cd ../frontend && npm install
   ```

3. **환경 변수 설정**
   - contracts/.env
   - backend/.env
   - frontend/.env.local

4. **실행**
   ```bash
   # Terminal 1
   cd backend && npm start
   
   # Terminal 2
   cd frontend && npm run dev
   ```

## 파일 목록

### ⚠️ 코드 복사 필요한 파일:
- contracts/hardhat.config.js
- contracts/contracts/CoinTossGasless.sol
- contracts/scripts/deploy.js
- backend/server.js
- frontend/config/wagmi.ts
- frontend/app/globals.css
- frontend/app/layout.tsx
- frontend/app/providers.tsx
- frontend/app/page.tsx
- frontend/app/play/page.tsx
- frontend/app/leaderboard/page.tsx
- frontend/components/BankrollDisplay.tsx

### ✅ 자동 생성된 파일:
- 모든 package.json
- 모든 .env 파일 (템플릿)
- 모든 설정 파일
