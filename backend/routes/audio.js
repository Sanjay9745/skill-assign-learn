const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Audio streaming endpoint
router.get('/stream', (req, res) => {
    try {
        // Get audio file path from query parameter
        const audioFile = req.query.file;
        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file parameter is required' });
        }

        // Construct full path (adjust based on your audio files location)
        const audioPath = path.join(__dirname, '../audio', audioFile);
        
        // Check if file exists
        if (!fs.existsSync(audioPath)) {
            return res.status(404).json({ error: 'Audio file not found' });
        }

        // Get file stats
        const stat = fs.statSync(audioPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            // Handle range requests for progressive loading
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            
            const file = fs.createReadStream(audioPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Range'
            };
            
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            // Serve entire file if no range requested
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*'
            };
            
            res.writeHead(200, head);
            fs.createReadStream(audioPath).pipe(res);
        }
    } catch (error) {
        console.error('Audio streaming error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get audio metadata endpoint
router.get('/metadata', (req, res) => {
    try {
        const audioFile = req.query.file;
        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file parameter is required' });
        }

        const audioPath = path.join(__dirname, '../audio', audioFile);
        
        if (!fs.existsSync(audioPath)) {
            return res.status(404).json({ error: 'Audio file not found' });
        }

        const stat = fs.statSync(audioPath);
        
        // Estimate duration based on file size (rough calculation for MP3)
        // For more accurate duration, you might want to use a library like node-ffmpeg
        const estimatedDuration = Math.round(stat.size / 16000); // Rough estimate for 128kbps MP3
        
        res.json({
            filename: audioFile,
            size: stat.size,
            estimatedDuration: estimatedDuration,
            supportedFormats: ['mp3', 'wav', 'ogg'],
            streamingSupported: true
        });
    } catch (error) {
        console.error('Metadata error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Progressive chunk endpoint for initial 10-second loading
router.get('/initial-chunk', (req, res) => {
    try {
        const audioFile = req.query.file;
        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file parameter is required' });
        }

        const audioPath = path.join(__dirname, '../audio', audioFile);
        
        if (!fs.existsSync(audioPath)) {
            return res.status(404).json({ error: 'Audio file not found' });
        }

        const stat = fs.statSync(audioPath);
        
        // Calculate approximate bytes for first 10 seconds
        // Assuming average bitrate of 128kbps for MP3
        const tenSecondsBytes = Math.min(160000, Math.floor(stat.size * 0.1)); // 10% or 160KB, whichever is smaller
        
        const file = fs.createReadStream(audioPath, { start: 0, end: tenSecondsBytes - 1 });
        
        const head = {
            'Content-Range': `bytes 0-${tenSecondsBytes - 1}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': tenSecondsBytes,
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*',
            'X-Initial-Chunk': 'true'
        };
        
        res.writeHead(206, head);
        file.pipe(res);
    } catch (error) {
        console.error('Initial chunk error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
