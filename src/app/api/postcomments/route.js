import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function POST(request) {
  const { postId, content, parentId } = await request.json();

  const { getUser } = getKindeServerSession(request);
  const user = await getUser();
  console.log(user)

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    let existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          id: user.id,
          givenName: user.given_name,
          picture: user.picture || "",
          email: user.email,
        },
      });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: existingUser.id,
        parentId: parentId || null,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(newComment, { status: 200 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      {
        message: "Failed to create comment",
      },
      { status: 500 }
    );
  }
}
