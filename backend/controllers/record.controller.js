const fs = require('fs');
const path = require('path');

const RECORDS_FILE = path.join(__dirname, '../data/records.json');

const getRecords = (req, res) => {
  try {
    const records = JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8'));
    return res.json(records);
  } catch (error) {
    console.error('Error reading records file:', error);
    return res.status(500).json({ message: 'Error retrieving access records.' });
  }
};

module.exports = {
  getRecords
};
