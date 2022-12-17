import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await clientPromise;
    res.send("connected");
  } catch (error) {
    res.send("error");
  }
}
