// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Xendit from 'xendit-node'

type Data = {
  status: string
}

const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY as string
})

const { Card } = x;
const cardSpecificOptions = {};
const card = new Card(cardSpecificOptions);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    console.log('POST')
  } else {
    res.status(200).json({ status: 'success' })
  }
}
