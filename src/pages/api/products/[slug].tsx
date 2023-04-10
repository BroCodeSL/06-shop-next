import type { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";

type Data =
  | { message: string; }
  | IProduct

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if( req.method === 'GET') {
    return getProductBySlug(req, res);
  } else {
    return res.status(400).json({
      message: "Bad request"
    });
  }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) {
    return res.status(400).json({ message: `Product ${slug} not found` });
  }

  return res.status(200).json(product);
};
