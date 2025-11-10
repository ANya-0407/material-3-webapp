import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession } from 'next-iron-session';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const token = Math.random().toString(36).substring(2);
        res.setHeader('Set-Cookie', `csrfToken=${token}; Path=/`);
        res.status(200).json({ csrfToken: token });
    } else {
        res.status(405).end(); // 405 Method Not Allowed
    }
};