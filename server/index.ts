import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { downloadLogo } from './get.js';

const PORT: number = parseInt(process.env.PORT || '3007');
const app = express();

const isDev = process.env.NODE_ENV === 'dev';

console.log(`Development mode: ${isDev}`);

const distPath = path.resolve('dist');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30 // limit each IP to 30 requests per minute
});

app.use(limiter);

app.disable('x-powered-by');

app.use(morgan('combined'));

if(!isDev) {
  // Serve static files from dist folder
  app.use(express.static(distPath));
}

app.get('/api/getLogo', async (req: Request, res: Response) => {
  try {
    const queryQ = req.query.q;
    if (typeof queryQ !== 'string') {
      return res.status(400).send("Query parameter 'q' is required and must be a string");
    }
    const result = await downloadLogo(queryQ);
    res.set('Content-Type', 'image/png'); // Assuming clearbit returns PNG, or could be more dynamic
    return res.send(result);
  } catch(e) {
    console.error(e);
    res.status(500).send(e instanceof Error ? e.message : "Internal Server Error");
  }
});

if(!isDev) {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
