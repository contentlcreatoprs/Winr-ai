# WINR — Your AI Teacher

A professional, friendly AI teacher created by LAKSHYA. WINR explains topics clearly, adapts to weak or vague prompts, helps with learning and everyday tasks, and occasionally uses light fun or quick questions when appropriate.

## 1. Run locally

Install Node.js, then:

```bash
npm install
```

Create `.env` from `.env.example` and put your API key inside:

```env
OPENAI_API_KEY=your_api_key_here
```

Start:

```bash
npm start
```

Open:

```text
http://localhost:10000
```

## 2. Deploy to Render

1. Create a GitHub repository.
2. Upload all project files.
3. In Render, create a **Web Service** and connect the repository.
4. Build Command:
   `npm install`
5. Start Command:
   `npm start`
6. Add Environment Variable:
   `OPENAI_API_KEY` = your API key.
7. Deploy.

Do not put the API key in `public/index.html`, `style.css`, or `script.js`.
