const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Tạo ứng dụng Express
const app = express();
const port = 5000; 


app.use(cors());

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'xenlulozo1', 
  database: 'petshop', 
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
app.get('/api/petsupplies', (req, res) => {
  const query = 'SELECT * FROM petSupplies';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
    } else {
      res.json(results);
    }
  });
});

// Bắt đầu server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
