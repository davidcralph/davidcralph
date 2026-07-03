import { Hono } from 'hono';

const app = new Hono();

const photos = [
  {
    id: 'faf04b66c193418d8e36a7b32c5b21e7',
    location: 'Copenhagen, Denmark',
  },
  {
    id: '8a61ab1fa6bf4aab8d09c7cb12fc25b1',
    location: 'London, UK',
  },
  {
    id: 'b239bff7cb1a4dfc83bb487370026c52',
    location: 'Lake District, UK',
  },
  {
    id: '08a772fce37c4d0b85602b0d320a4f08',
    location: 'Cheshire, UK',
  },
  {
    id: '83a08507688742d4a288a5d54a020a29',
    location: 'Seoul, South Korea',
  },
  {
    id: 'd00f47b974214db8a2a7e839514ad333',
    location: 'Sapporo, Japan',
  },
  {
    id: '4e7ee1e0f1704d759215f22840ab9de1',
    location: 'Berlin, Germany',
  },
  {
    id: 'db2f99ed1fa740c894565574aed9b107',
    location: 'Brussels, Belgium',
  },
  {
    id: '9c28edfc60254326b0a801d43d2718c2',
    location: 'Dublin, Ireland',
  },
];

const escapeXml = (s) =>
  s.replace(/[<>&'"]/g, (ch) => {
    switch (ch) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });

app.get('/overlay', (c) => {
  const text = c.req.query('text') ?? '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="90" viewBox="0 0 450 90"><rect width="450" height="90" fill="#000"/><text x="225" y="45" fill="#fff" font-family="sans-serif" font-size="28" font-weight="600" text-anchor="middle" dominant-baseline="central">${escapeXml(text)}</text></svg>`;
  return c.body(svg, 200, { 'Content-Type': 'image/svg+xml' });
});

app.get('/', async (c) => {
  const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
  const { id, location } = randomPhoto;

  const overlaySvgUrl = `${new URL(c.req.url).origin}/overlay?text=${encodeURIComponent('Taken in ' + location)}`;
  const textOverlayUrl = `https://images.weserv.nl/?url=${encodeURIComponent(overlaySvgUrl)}&output=png`;
  const imageUrl = 'https://cdn.muetab.com/img/hd/' + id + '.webp';

  const res = await fetch(
    'https://images.weserv.nl/?url=' +
      encodeURIComponent(imageUrl) +
      '&w=1500&h=500&fit=cover&auto=format',
    {
      cf: {
        image: {
          draw: [
            {
              url: textOverlayUrl,
              bottom: 0,
              left: 0,
              width: 250,
              height: 225,
              fit: 'contain',
              opacity: 0.9,
            },
          ],
        },
      },
    },
  );

  return res;
});

export default app;
