require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001; // 通常後端用 3000 或 3001

// 中介軟體
app.use(cors()); // 啟用 CORS
app.use(express.json()); // 解析 JSON 格式的請求主體
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 格式的請求主體

// 基本路由測試
app.get('/', (req, res) => {
  res.send('Hello from HanceWeb2.0 Backend!');
});

// 之後會在這裡加入其他的路由
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/about', require('./routes/aboutRoutes'));
// app.use('/api/portfolio', require('./routes/portfolioRoutes'));

// 資料庫連接
mongoose.connect(process.env.MONGODB_URI) // Mongoose 6+ 不需要額外選項
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 