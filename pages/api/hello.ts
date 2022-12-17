// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";

type Data = {
  token?: JWT;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = await getToken({
    req,
    secret: "MySecretPassword",
  });
  console.log(token);
  res.json(token ? { token } : {});
}
