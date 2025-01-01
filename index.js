const fs = require('fs');
const path = require('path');


const dataFilePath = path.join(__dirname, 'data.json');
const backupFilePath = path.join(__dirname, 'data_backup.json');


function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return null;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing file: ${error.message}`);
    }
}

function backupFile() {
    try {
        fs.copyFileSync(dataFilePath, backupFilePath);
        console.log('Backup created successfully.');
    } catch (error) {
        console.error(`Error creating backup: ${error.message}`);
    }
}


function addEntry(data, path, newEntry) {
    let current = data;
    path.forEach((key, index) => {
        if (!current[key]) {
            if (index === path.length - 1) {
                current[key] = newEntry;
            } else {
                current[key] = {};
            }
        }
        current = current[key];
    });
}

function updateEntry(data, path, updatedValue) {
    let current = data;
    path.forEach((key, index) => {
        if (!current[key]) throw new Error(`Invalid path: ${key} does not exist`);
        if (index === path.length - 1) current[key] = updatedValue;
        current = current[key];
    });
}

function deleteEntry(data, path) {
    let current = data;
    path.forEach((key, index) => {
        if (!current[key]) throw new Error(`Invalid path: ${key} does not exist`);
        if (index === path.length - 1) delete current[key];
        current = current[key];
    });
}

function searchEntry(data, searchTerm) {
    const results = [];
    function searchRecursively(obj, path = []) {
        for (const key in obj) {
            const newPath = [...path, key];
            if (typeof obj[key] === 'object') {
                searchRecursively(obj[key], newPath);
            } else if (obj[key].toString().includes(searchTerm)) {
                results.push({ path: newPath, value: obj[key] });
            }
        }
    }
    searchRecursively(data);
    return results;
}


if (!fs.existsSync(dataFilePath)) {
    console.error('Data file does not exist. Please create data.json first.');
    process.exit(1);
}

const data = readJsonFile(dataFilePath);

backupFile();

try {
    
    addEntry(data, ['university', 'departments', 'ComputerScience', 'students'], 'Eve');
    
    
    updateEntry(data, ['university', 'departments', 'Mathematics', 'professors', 0], 'Dr. Allen Jr.');
    
    
    deleteEntry(data, ['university', 'departments', 'ComputerScience', 'students', 1]);
    
    
    const searchResults = searchEntry(data, 'Dr.');
    console.log('Search Results:', searchResults);
    
    
    writeJsonFile(dataFilePath, data);
} catch (error) {
    console.error(`Error during operation: ${error.message}`);
}
