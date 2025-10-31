const express = require('express');
const mysql = require('mysql2');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());

// Kết nối MySQL (Cập nhật thông tin kết nối của bạn)
const db = mysql.createConnection({
  host: 'localhost', // Thay bằng host MySQL cloud
  user: 'root',        // Tên đăng nhập MySQL
  password: 'xenlulozo1',    // Mật khẩu MySQL
  database: 'petshop',          // Tên database
});

// Kết nối cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL: ' + err.stack);
    return;
  }
  console.log('Kết nối MySQL thành công');
});

// API để lấy danh sách sản phẩm
app.get('/petsupplies', (req, res) => {
  const query = 'SELECT * FROM petSupplies';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
    } else {
      res.json(results);
    }
  });
});

// Export function cho Netlify
module.exports.handler = serverless(app);
