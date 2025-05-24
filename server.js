equire('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

// ⭐️ 必須加這行，才能解析 JSON body
app.use(express.json());

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

// Webhook 路由設定
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error('處理事件時錯誤：', err);
      res.status(500).end();
    });
});

// 處理收到的訊息
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `您傳的是：${event.message.text}`
  });
}

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ 伺服器啟動成功，監聽在 port ${port}`);
});

