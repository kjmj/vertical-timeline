const fs = require('fs');

/**
 * Parses the given CSV file into an array of objects. Each object's keys is determined by the header row, with content
 * indicated by the row
 *
 * @param fileName Name of the file to use
 * @returns {Array} Array of parsed objects
 */
function parseCSV(fileName) {
    let file = fs.readFileSync(`../${fileName}`, 'utf8');
    file = file.replace(/\r\n/g, '\n');
    file = file.replace(/\r/g, '');
    let lines = file.split('\n');
    lines = lines.filter(item => item !== '');

    if (lines.length < 2) {
        return [];
    }

    const keys = lines[0].split(',');
    let items = [];
    for (let i = 1; i < lines.length; i += 1) {
        items.push({});
        const curVals = lines[i].split(',');
        for (let j = 0; j < keys.length; j += 1) {
            items[i-1][keys[j]] = curVals[j];
        }
    }
    return items;
}
