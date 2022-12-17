// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

interface TypeNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

export default async function handler(
  req: TypeNextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const users = (await clientPromise).db("test").collection("users");
  const user = await users.insertOne({ email, password });
  res.json({ email, password });
}
