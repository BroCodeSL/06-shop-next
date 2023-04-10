import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';

type Data =
 | { message: string }
 | IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if(req.method === 'GET'){
    return searchProducts(req, res);
  } else {
    return res.status(400).json({ message: "Bad request" });
  }

}


const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  let { q = '' } = req.query;

  if ( !q.length ) {
    return res.status(400).json({ message: "You must specify the search query" });
  }

  q.toString().toLowerCase();

  db.connect();
  const products = await Product.find({
    $text: { $search: `${q}` }
  })
  .select("title images price inStock slug -_id")
  .lean();
  db.disconnect();

  return res.status(200).json(products);
}

