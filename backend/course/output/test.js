const fs = require('fs');
const path = require('path');

// Get the current directory
const currentDir = __dirname;

// Read all files in the directory
fs.readdir(currentDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter for .mp3 files
    const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

    mp3Files.forEach(file => {
        const baseName = path.basename(file, '.mp3');
        const newName = `${baseName}-audio-mal.mp3`;
        const oldPath = path.join(currentDir, file);
        const newPath = path.join(currentDir, newName);

        // Rename the file
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error(`Error renaming ${file}:`, err);
            } else {
                console.log(`Renamed: ${file} -> ${newName}`);
            }
        });
    });
});