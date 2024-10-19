import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function DELETE(request) {
  const { commentId } = await request.json();

  const { getUser } = getKindeServerSession(request);
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== user.id) {
      return NextResponse.json(
        { message: "Comment not found or not authorized to delete" },
        { status: 404 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(
      {
        message: "Comment delete successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete comment:", error)
    return NextResponse.json({
        message: "Failed to delete comment"
    }, {status:500})
  }
}
