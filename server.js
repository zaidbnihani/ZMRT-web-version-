import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'comments.json');

// Helper to safely load data
function getStore() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = {
        downloads: 12840,
        comments: [
          {
            id: 'c1',
            name: 'عمر النبهاني',
            rating: 5,
            text: 'تطبيق ممتاز جداً ونقاء الصوت في المكالمات بجودة Opus HD لا يضاهى! خفيف جداً على الجهاز ولا يستهلك البطارية.',
            date: new Date(Date.now() - 86400000).toISOString(),
            device: 'Android',
            likes: 24
          },
          {
            id: 'c2',
            name: 'سارة القحطاني',
            rating: 5,
            text: 'المكالمات المرئية واضحة وبدون أي تقطيع حتى مع الإنترنت البطيء. التصميم الزمردي الأنيق والواجهة البسيطة رائعة للغاية.',
            date: new Date(Date.now() - 172800000).toISOString(),
            device: 'Android',
            likes: 19
          },
          {
            id: 'c3',
            name: 'طارق الشامي',
            rating: 5,
            text: 'أفضل بديل للتواصل السريع والآمن. ميزة الاتصال بنقرة واحدة والخصوصية العالية تجعله تطبيقي الأساسي يومياً.',
            date: new Date(Date.now() - 259200000).toISOString(),
            device: 'Android',
            likes: 15
          }
        ]
      };
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading comments file:', err);
    return { downloads: 12840, comments: [] };
  }
}

// Helper to safely save data
function saveStore(store) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving comments file:', err);
  }
}

// Serve vendor scripts from node_modules
app.use('/vendor/gsap', express.static(path.join(__dirname, 'node_modules/gsap/dist')));
app.use('/vendor/confetti', express.static(path.join(__dirname, 'node_modules/canvas-confetti/dist')));

// API: Get comments and statistics
app.get('/api/comments', (req, res) => {
  const store = getStore();
  const sorted = [...(store.comments || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate average rating
  const total = sorted.length;
  const sum = sorted.reduce((acc, c) => acc + (Number(c.rating) || 5), 0);
  const avg = total > 0 ? (sum / total).toFixed(1) : '5.0';

  res.json({
    success: true,
    downloads: store.downloads || 12840,
    totalComments: total,
    averageRating: avg,
    comments: sorted
  });
});

// API: Add a new comment to archive
app.post('/api/comments', (req, res) => {
  const { name, rating, text, device } = req.body || {};
  
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال اسمك' });
  }
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ success: false, error: 'يرجى كتابة نص التعليق' });
  }

  const cleanRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
  const newComment = {
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: name.trim().slice(0, 50),
    rating: cleanRating,
    text: text.trim().slice(0, 500),
    date: new Date().toISOString(),
    device: device ? String(device).slice(0, 20) : 'Android',
    likes: 0
  };

  const store = getStore();
  if (!store.comments) store.comments = [];
  store.comments.unshift(newComment);
  saveStore(store);

  res.status(201).json({
    success: true,
    message: 'تم حفظ تعليقك بنجاح في أرشيف المستخدمين',
    comment: newComment
  });
});

// API: Like / react to a comment
app.post('/api/comments/:id/like', (req, res) => {
  const commentId = req.params.id;
  const store = getStore();
  const comment = (store.comments || []).find(c => c.id === commentId);
  if (!comment) {
    return res.status(404).json({ success: false, error: 'التعليق غير موجود' });
  }
  comment.likes = (comment.likes || 0) + 1;
  saveStore(store);
  res.json({ success: true, likes: comment.likes });
});

// API: Delete a comment
app.delete('/api/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const store = getStore();
  const initialLength = (store.comments || []).length;
  store.comments = (store.comments || []).filter(c => c.id !== commentId);
  if (store.comments.length === initialLength) {
    return res.status(404).json({ success: false, error: 'التعليق غير موجود' });
  }
  saveStore(store);
  res.json({ success: true, message: 'تم حذف التعليق بنجاح' });
});

// API: Get & increment downloads
app.get('/api/firebase-config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return res.json({ success: true, config });
    }
  } catch (err) {
    console.error('Error reading firebase config:', err);
  }
  res.status(404).json({ success: false, error: 'Firebase config not found' });
});

app.get('/api/downloads', (req, res) => {
  const store = getStore();
  res.json({ success: true, downloads: store.downloads || 12840 });
});

app.post('/api/downloads/increment', (req, res) => {
  const store = getStore();
  store.downloads = (store.downloads || 12840) + 1;
  saveStore(store);
  res.json({ success: true, downloads: store.downloads });
});

// Serve static assets from root directory
app.use(express.static(__dirname));

// Route root to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicit route for Privacy Policy & Terms full page
app.get(['/سياسة%20الخصوصية.html', '/سياسة الخصوصية.html', '/privacy.html', '/terms.html', '/privacy-policy.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'سياسة الخصوصية.html'));
});

// Explicit route for ZMRT.html (redirect to root)
app.get('/ZMRT.html', (req, res) => {
  res.redirect(301, '/');
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
