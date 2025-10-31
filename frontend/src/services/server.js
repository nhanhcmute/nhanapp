const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use("/images", express.static("src/asset/images"));

// Cấu hình multer để lưu ảnh vào thư mục src/asset/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "src/asset/images";
    // Kiểm tra nếu thư mục không tồn tại thì tạo mới
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
  },
});

const upload = multer({ storage: storage });

// Đọc dữ liệu từ file db.json
const getUserData = () => {
  try {
    const data = fs.readFileSync("db.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi đọc db.json:", error);
    return { signup: [], products: [] };
  }
};

const saveUserData = (data) => {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

// API: Thêm sản phẩm mới
app.post("/products", upload.single("image"), (req, res) => {
  const { name, price, stock } = req.body;

  // Kiểm tra nếu có file ảnh được gửi lên
  if (!req.file) {
    return res.status(400).json({ message: "Vui lòng tải lên ảnh sản phẩm!" });
  }

  // Đường dẫn ảnh sau khi upload
  const imageURL = `/images/${req.file.filename}`;

  const newProduct = { id: Date.now().toString(), name, price, stock, image: imageURL };

  // Lưu sản phẩm vào db.json
  const data = getUserData();
  data.products.push(newProduct);

  // Cập nhật lại db.json
  saveUserData(data);

  res.status(201).json({ message: "Sản phẩm đã được thêm!", product: newProduct });
});

// API: Lấy danh sách sản phẩm
app.get("/products", (req, res) => {
  try {
    const products = getUserData().products || [];
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy sản phẩm!" });
  }
});

// API: Cập nhật sản phẩm
app.put("/products/:id", upload.single("image"), (req, res) => {
  const { name, price, stock } = req.body;
  const productId = req.params.id;

  const data = getUserData();
  const productIndex = data.products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
  }

  // Nếu có ảnh mới được tải lên, thay đổi ảnh sản phẩm
  let imageURL = data.products[productIndex].image;
  if (req.file) {
    imageURL = `/images/${req.file.filename}`;
  }

  // Cập nhật sản phẩm
  const updatedProduct = {
    ...data.products[productIndex],
    name,
    price,
    stock,
    image: imageURL,
  };

  // Cập nhật lại dữ liệu trong db.json
  data.products[productIndex] = updatedProduct;
  saveUserData(data);

  res.status(200).json({ message: "Sản phẩm đã được cập nhật!", product: updatedProduct });
});

// API: Xóa sản phẩm
app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  const data = getUserData();
  const productIndex = data.products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
  }

  // Xóa sản phẩm khỏi mảng
  data.products.splice(productIndex, 1);
  saveUserData(data);

  res.status(200).json({ message: "Sản phẩm đã được xóa!" });
});

// API: Đăng ký người dùng mới
app.post("/signup", async (req, res) => {
  const { name, email, username, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    const users = getUserData().signup;
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
    }

    const existingEmail = users.find((user) => user.email === email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu và xác nhận mật khẩu không khớp!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { id: Date.now().toString(), name, email, username, password: hashedPassword };
    users.push(newUser);
    saveUserData({ signup: users, products: getUserData().products || [] });

    res.status(201).json({ message: "Đăng ký thành công!", user: { username, name, email } });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
});
let cart = []; // Mock database giỏ hàng

// API để cập nhật giỏ hàng bằng POST
app.post('/cart/update', (req, res) => {
    const { cart: updatedCart } = req.body; // Dữ liệu giỏ hàng mới từ client

    if (!Array.isArray(updatedCart)) {
        return res.status(400).send({ message: 'Dữ liệu không hợp lệ' });
    }

    // Cập nhật giỏ hàng
    cart = updatedCart;

    res.status(200).send({ message: 'Cập nhật giỏ hàng thành công', cart });
});
let addresses = [];

// Định nghĩa route POST để thêm địa chỉ mới
app.post('/addresses', (req, res) => {
  const newAddress = req.body;

  // Tạo id cho địa chỉ mới dưới dạng chuỗi
  const id = Date.now().toString(); // Chuyển id thành chuỗi
  newAddress.id = id;

  // Thêm địa chỉ vào danh sách
  addresses.push(newAddress);

  // Trả về địa chỉ đã thêm, bao gồm id dưới dạng chuỗi
  res.status(200).json({ address: newAddress });
});
// API: Xóa địa chỉ
app.delete('/addresses/:id', async (req, res) => {
  const addressId = req.params.id;
  try {
    const result = await Address.deleteOne({ _id: addressId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ để xóa" });
    }
    res.status(200).json({ message: "Địa chỉ đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa địa chỉ", error });
  }
});
// API: Đăng nhập
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = getUserData().signup;
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ message: "Tên đăng nhập không tồn tại!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Sai mật khẩu!" });
    }

    const role = username === "admin" ? "admin" : "user";

    res.status(200).json({
      isAuthenticated: true,
      message: "Đăng nhập thành công!",
      user: { id: user.id, username: user.username, name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi kết nối đến máy chủ!" });
  }
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
