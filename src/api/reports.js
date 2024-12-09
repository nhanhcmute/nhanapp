export const fetchSalesData = async (dateRange) => {
    try {
      // Gọi API từ JSON Server
      const response = await fetch(`http://localhost:5000/salesData?dateRange=${dateRange}`);
  
      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
  
      // Chuyển đổi phản hồi thành JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sales data:', error);
  
      // Nếu có lỗi, bạn có thể thêm log chi tiết hơn ở đây
      if (error.response) {
        console.error('Response error:', error.response);
      }
  
      return null;  // Trả về null nếu có lỗi
    }
  };
  