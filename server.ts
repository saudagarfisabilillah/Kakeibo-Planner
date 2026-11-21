import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const PORT = Number(process.env.PORT) || 3000;

  // Initialize Gemini AI client if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), aiEnabled: !!ai });
  });

  // Receipt Scanner endpoint using Gemini AI
  app.post('/api/ai/scan-receipt', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const { imageBase64, mimeType = 'image/jpeg' } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Image base64 data is required.' });
      }

      // Clean base64 header if present
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this receipt image and extract the following details in JSON format only (no markdown code blocks, just raw JSON):
            {
              "merchant": "Name of store or merchant",
              "amount": total amount as number (e.g. 45000),
              "date": "YYYY-MM-DD" format (estimate today if not found),
              "category": one of ["Makanan & Minuman", "Transportasi", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Lainnya"],
              "note": "Brief description of items purchased"
            }`,
          },
        ],
      });

      const text = response.text || '{}';
      // Clean up markdown code blocks if any
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);

      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error scanning receipt:', error);
      res.status(500).json({ error: error.message || 'Failed to scan receipt' });
    }
  });

  // Financial Advisor AI Insights endpoint
  app.post('/api/ai/advice', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const { transactions, budgetSummary, language = 'id' } = req.body;

      const prompt = language === 'id'
        ? `Bertindaklah sebagai penasihat keuangan pribadi yang ramah dengan persona maskot chibi kiyowo. Berikan 3-4 tips dan analisis singkat yang membangun dan memotivasi berdasarkan data keuangan berikut:\n${JSON.stringify({ transactions: transactions?.slice(-20), budgetSummary })}\nBerikan output dalam format JSON dengan array objek: [{"title": "...", "advice": "...", "type": "success|warning|info"}] tanpa markdown code block.`
        : `Act as a friendly personal financial advisor with a cute chibi persona. Provide 3-4 concise, encouraging financial tips and analysis based on this financial data:\n${JSON.stringify({ transactions: transactions?.slice(-20), budgetSummary })}\nReturn output in JSON format with an array of objects: [{"title": "...", "advice": "...", "type": "success|warning|info"}] without markdown code blocks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ text: prompt }],
      });

      const text = response.text || '[]';
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedText);

      res.json({ success: true, advice: parsed });
    } catch (error: any) {
      console.error('Error getting AI advice:', error);
      res.status(500).json({ error: error.message || 'Failed to generate financial advice' });
    }
  });

  if (isProduction) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
