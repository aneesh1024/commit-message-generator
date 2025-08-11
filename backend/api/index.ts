import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-commit', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing `text` in request body' });
  }

  const prompt = `
    You are an assistant that writes Git commit messages using the Conventional Commits specification.

    Given the following code diff, return a commit message in the following JSON format ONLY:

    {
      "type": "<type>",       // One of: feat, fix, chore, docs, style, refactor, perf, test
      "scope": "<scope>",     // (Optional) file, feature, or component name (like auth, db, etc.)
      "description": "<description>"  // A short description of the change
    }

    Code diff:
    ${text}

    Respond only with valid JSON and nothing else. Do not include any commentary, explanations, or markdown formatting.
    `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text().trim();

    let jsonText = '';
    const match =
      rawText.match(/```json\s*([\s\S]*?)\s*```/i) ||
      rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      return res
        .status(500)
        .json({ error: 'Failed to extract JSON from AI response', rawText });
    }

    try {
      jsonText = match[1] || match[0];
      const structuredCommit = JSON.parse(jsonText);
      res.json({ commitMessage: structuredCommit });
    } catch (parseErr) {
      return res.status(500).json({
        error: 'Failed to parse JSON from AI response',
        jsonText,
        rawText,
      });
    }
  } catch (error: any) {
    console.error('Gemini SDK error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate commit message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
