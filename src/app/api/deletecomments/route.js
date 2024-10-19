import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const { commentId } = await request.json();

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
    await prisma.comment.delete({
      where: { id: commentId },
    });
    return NextResponse.json({ message: "comment deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
