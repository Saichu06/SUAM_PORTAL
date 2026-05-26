const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

// GET /users - Admin fetches all users
const getUsers = (req, res) => {
  try {
    const users = readUsers();
    // Exclude password from response for safety
    const safeUsers = users.map(({ password, ...u }) => u);
    return res.json(safeUsers);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users.' });
  }
};

// POST /users - Add user
const createUser = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  try {
    const users = readUsers();

    // Check if user already exists
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      username,
      password,
      role,
      lastLogin: null
    };

    users.push(newUser);
    writeUsers(users);

    const { password: _, ...safeUser } = newUser;
    return res.status(201).json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user.' });
  }
};

// PUT /users/:id - Edit user role/username
const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;

  try {
    const users = readUsers();
    const userId = parseInt(id, 10);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if new username conflicts with another user
    if (username && username.toLowerCase() !== users[userIndex].username.toLowerCase()) {
      const exists = users.some(u => u.id !== userId && u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
      users[userIndex].username = username;
    }

    if (role) {
      // Prevent admin from removing their own admin privileges to avoid lockout
      if (req.user.id === userId && role !== 'Admin') {
        return res.status(400).json({ message: 'You cannot revoke your own Admin role.' });
      }
      users[userIndex].role = role;
    }

    writeUsers(users);

    const { password, ...safeUser } = users[userIndex];
    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user.' });
  }
};

// DELETE /users/:id - Delete user
const deleteUser = (req, res) => {
  const { id } = req.params;

  try {
    const users = readUsers();
    const userId = parseInt(id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent deleting oneself
    if (req.user.id === userId) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    writeUsers(updatedUsers);

    return res.json({ message: 'User deleted successfully.', deletedId: userId });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user.' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
