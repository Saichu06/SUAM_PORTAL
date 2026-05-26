const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const JWT_SECRET = 'suam_secret_key_2026_super_secure';

const login = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'User ID, Password, and Role are required.' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    
    // Find matching user with case-insensitive username match or exact match
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password && 
      u.role.toLowerCase() === role.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid username, password, or role.' });
    }

    // Capture the current lastLogin before updating it
    const lastLoginTime = user.lastLogin || new Date().toISOString();

    // Update user's last login in the JSON file
    user.lastLogin = new Date().toISOString();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        lastLogin: lastLoginTime // return the previous last login to display
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error processing authentication.' });
  }
};

module.exports = {
  login,
  JWT_SECRET
};
