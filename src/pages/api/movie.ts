import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const email = session.user.email;

  if (req.method === "POST") {
    const { movie } = req.body;

    try {
      await prisma.user.update({
        where: { email },
        data: { favoriteMovie: movie },
      });

      return res.status(200).json({ message: "Movie saved" });
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      return res
        .status(200)
        .json({ favoriteMovie: user?.favoriteMovie ?? null });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch movie" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
