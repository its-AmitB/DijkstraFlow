const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('introduction', { activePage: 'introduction', title: 'Dijkstra Visualizer' });
});

app.get('/editor', (req, res) => {
  res.render('editor', { activePage: 'editor', title: 'Code Editor - Dijkstra Visualizer' });
});

app.get('/visualizer', (req, res) => {
  res.render('visualizer', { activePage: 'visualizer', title: 'Visualizer - Dijkstra Visualizer' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
