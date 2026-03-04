export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = '31963e92-d17b-8177-942b-f4660d0dd652';

  const payload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Email: { title: [{ text: { content: email } }] },
      'Submitted At': { date: { start: new Date().toISOString() } },
      Source: { rich_text: [{ text: { content: 'thesidequest-ten.vercel.app' } }] },
    },
  };

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Notion error:', err);
    return res.status(500).json({ error: 'Failed to save. Please try again.' });
  }

  return res.status(200).json({ success: true });
}
