import type { NextApiRequest, NextApiResponse } from 'next';
import bcryptjs from 'bcryptjs';

import { db } from '@/database';
import { User } from '@/models';
import { jwt, validations } from '@/utils';

type Data =
  | { message: string }
  | {
    token: string,
    user: {
      name: string,
      email: string,
      role: string
    }
  }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  if ( req.method === 'POST' ) {
    return registerUser(req, res);
  } else {
    res.status(400).json({ message: 'Bad request' });
  }
};

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body as {
    email: string,
    password: string,
    name: string
  };

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be 6 characters or more' });
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Name must be 2 characters or more' });
  }

  if ( !validations.isValidEmail(email) ) {
    return res.status(400).json({ message: 'The email does not seem to be valid' });
  }

  await db.connect();
  const user = await User.findOne({ email });

  if ( user ) {
    await db.disconnect();
    return res.status(400).json({ message: 'That email is already registered' });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcryptjs.hashSync(password),
    role: 'client',
    name
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Review server logs'
    })
  }

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name
    }
  });
}
