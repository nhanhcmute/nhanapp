const express = require('express');
const mysql = require('mysql2');
const serverless = require('serverless-http');
const cors = require('cors');

// Tạo app Express
const app = express();
app.use(cors());
app.use(express.json()); // Để nhận dữ liệu JSON trong POST và PUT

// Kết nối MySQL (Cập nhật thông tin kết nối của bạn)
const db = mysql.createConnection({
  host: 'your-database-host', // Thay bằng host MySQL cloud của bạn
  user: 'your-db-user',       // Thay bằng tên đăng nhập MySQL
  password: 'your-db-password',  // Thay bằng mật khẩu MySQL
  database: 'petshop',          // Thay bằng tên database của bạn
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

// API để thêm sản phẩm
app.post('/petsupplies', (req, res) => {
  const { name, price, description } = req.body;
  const query = 'INSERT INTO petSupplies (name, price, description) VALUES (?, ?, ?)';
  db.query(query, [name, price, description], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    } else {
      res.status(201).json({ message: 'Sản phẩm đã được thêm' });
    }
  });
});

// API để cập nhật thông tin sản phẩm
app.put('/petsupplies/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const query = 'UPDATE petSupplies SET name = ?, price = ?, description = ? WHERE id = ?';
  db.query(query, [name, price, description, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    } else {
      res.json({ message: 'Sản phẩm đã được cập nhật' });
    }
  });
});

// API để xóa sản phẩm
app.delete('/petsupplies/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM petSupplies WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    } else {
      res.json({ message: 'Sản phẩm đã được xóa' });
    }
  });
});

// Export function cho Netlify
module.exports.handler = serverless(app);
