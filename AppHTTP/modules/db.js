
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db.json');

function readDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return {books: []};
    }
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}


module.exports = {
    readDB,
    writeDB
};