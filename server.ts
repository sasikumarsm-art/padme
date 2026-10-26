import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

// Route handlers for clean URLs
const routeMap: Record<string, string> = {
  '/': 'index.html',
  '/about-padme-oasis': 'about-padme-oasis.html',
  '/about-anushree': 'about-anushree.html',
  '/individual-coaching': 'individual-coaching.html',
  '/private-coaching': 'private-coaching.html',
  '/group-coaching': 'group-coaching.html',
  '/retreats': 'retreats.html',
  '/corporate-leadership-development': 'corporate-leadership-development.html',
  '/executive-coaching': 'executive-coaching.html',
  '/our-approach': 'our-approach.html',
  '/insights': 'insights.html',
  '/insights/leading-in-the-age-of-ai': 'insight-article.html',
  '/contact': 'contact.html'
};

Object.entries(routeMap).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
  if (route !== '/') {
    app.get(`${route}/`, (req, res) => {
      res.sendFile(path.join(__dirname, file));
    });
  }
});

// API endpoint for Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, enquiryType, message } = req.body;
  if (!name || !email || !enquiryType || !message) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
  }
  return res.json({
    success: true,
    message: 'Thank you for reaching out to Padme Oasis. Anushree and our team will review your message and connect with you within 24-48 business hours.'
  });
});

// Fallback to static html files if requested directly (.html extension)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Padme Oasis website running on http://localhost:${PORT}`);
});
