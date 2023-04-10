import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
    case 'PUT':
      case 'POST':
  
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}