import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const { commentId, content } = await request.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (comment.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}
