const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for shared notes (not persistent; for production, use Redis/MongoDB)
const sharedNotes = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Put index.html in public folder

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Share endpoint
app.post('/api/share', (req, res) => {
    const { content, editable } = req.body;
    const shortId = shortid.generate().substring(0, 6); // Short 6-char ID
    sharedNotes.set(shortId, { content, editable });
    res.json({ shortId });
});

// Get shared note
app.get('/api/share/:id', (req, res) => {
    const { id } = req.params;
    const note = sharedNotes.get(id);
    if (!note) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.json(note);
});

// For shared links: Serve index.html but load via JS
app.get('/s/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});