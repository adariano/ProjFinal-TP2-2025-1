import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");
    if (!file || typeof file === "string" || !userId) {
      return NextResponse.json({ error: "Arquivo ou userId não enviado" }, { status: 400 });
    }

    // Salvar arquivo em /public/profile-photos
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `profile_${userId}_${Date.now()}.jpg`;
    const savePath = path.join(process.cwd(), "public", "profile-photos", fileName);
    await fs.mkdir(path.dirname(savePath), { recursive: true });
    await fs.writeFile(savePath, buffer);

    // Atualizar usuário no banco
    const publicUrl = `/profile-photos/${fileName}`;
    try {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { photoUrl: publicUrl },
      });
    } catch (err) {
      return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao salvar foto" }, { status: 500 });
  }
}
