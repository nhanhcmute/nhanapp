import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, get, remove, child } from 'firebase/database';
import { database } from '../../firebaseConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = ref(database, 'users'); // Truy cập vào node 'users' trong Realtime Database
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setNewUser({ name: user.name, email: user.email, role: user.role });
    } else {
      setNewUser({ name: '', email: '', role: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveUser = async () => {
    const userRef = ref(database, 'users');
    const newUserId = selectedUser ? selectedUser.id : Date.now().toString(); // Tạo id nếu là user mới

    try {
      await set(child(userRef, newUserId), newUser); // Thêm hoặc cập nhật user trong database
      toast.success(selectedUser ? 'User updated successfully' : 'User added successfully');
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    const userRef = ref(database, `users/${userId}`);
    try {
      await remove(userRef); // Xóa user khỏi database
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 3 }}>
        Quản lý người dùng
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => handleOpenDialog()} 
        sx={{ marginBottom: 3, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Thêm người dùng
      </Button>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Paper sx={{ padding: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" align="center">{user.name}</Typography>
              <Typography variant="body1" align="center">{user.email}</Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Role: {user.role}
              </Typography>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => handleOpenDialog(user)} 
                    fullWidth
                  >
                    Sửa
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDeleteUser(user.id)} 
                    fullWidth
                  >
                    Xóa
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedUser ? 'Sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên người dùng"
            fullWidth
            margin="normal"
            name="name"
            value={newUser.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={newUser.email}
            onChange={handleChange}
          />
          <Select 
            label="Role" 
            fullWidth 
            margin="normal" 
            name="role" 
            value={newUser.role} 
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="staff">Nhân viên</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ paddingX: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ width: '100%' }}>Hủy</Button>
          <Button onClick={handleSaveUser} sx={{ width: '100%' }}>
            {selectedUser ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
