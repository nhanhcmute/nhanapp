const express = require('express');
const upload = require('../multerConfig'); // Import multer config
const router = express.Router();
const Product = require('../models/Product');

router.put('/products/:id', upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, quantity, price } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, quantity, price, ...(image && { image }) },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Cập nhật sản phẩm thất bại' });
    }
  });
  
  module.exports = router;