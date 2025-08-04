import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import OpenAI from "openai";
import { prisma } from "../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.favoriteMovie) {
    return res.status(400).json({ error: "Favorite movie not found" });
  }

  const prompt = `Tell me a fun or interesting fact about the movie "${user.favoriteMovie}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const fact = completion.choices[0]?.message?.content || "No fact found";

    return res.status(200).json({ fact });
  } catch (error) {
    return res.status(500).json({ error: "OpenAI error" });
  }
}
