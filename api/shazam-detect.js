export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey =
    process.env.VITE_RAPIDAPI_KEY ||
    process.env.RAPIDAPI_KEY ||
    '74a2389031msh31259efa08f230ap1096b1jsn61a1c6f2ca6c';

  try {
    let base64Audio = '';
    if (typeof req.body === 'string') {
      base64Audio = req.body;
    } else if (req.body && req.body.audio) {
      base64Audio = req.body.audio;
    } else if (req.body && req.body.data) {
      base64Audio = req.body.data;
    } else if (typeof req.body === 'object') {
      base64Audio = JSON.stringify(req.body);
    }

    const response = await fetch('https://shazam.p.rapidapi.com/songs/v2/detect', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
      },
      body: base64Audio,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Shazam proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
