# MC-XIbot
這是可以登入任何MC伺服器的基岩版本客戶端
目前主要適用於廢土基岩版本伺服器
bedrock.mcfallout.net
 
### 設定檔案(config.jcon)
```json {
  "bot": {
    "host": "",         // 伺服器IP
    "port": 19132,      // 伺服器端點 (Minecraft Bedrock 預設)
    "username": "",     // 玩家名稱 (可隨意取)
    "offline": false,   // 是否開啟驗證/未驗證模式
    "version": "1.21.100" // bot登入版本
  },
  "features": {
    "autoReconnect": {
      "enabled": true,  // 是否自動重連
      "delay": 5000,    // 重連延遲時間 (毫秒)
      "maxRetries": 20  // 嘗試次數
    },
    "advertisement": {
      "enabled": false, // 是否開啟廣告
      "messages": [
        {
          "text": "test123", // 廣告內容
          "interval": 300000 // 廣告延遲時常 (毫秒)
        }
      ]
    },
    "teleport": {
      "enabled": true,  // 是否啟用自動 /tok (可能指某種傳送或認證指令)
      "allowedPlayers": ["xiaobai8088"] // 管理員 (允許使用此功能的玩家)
    }
  }
} 

### 聯絡作者
若有問題 我的 Discord ID： **billxiaobai** or **namiyuto**

也可以加入社群一起討論：(https://discord.gg/xNpjQChDTW)
