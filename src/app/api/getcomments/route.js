import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      {
        message: "postId is required",
      },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({
        message:"Failed to fetch comments"
    }, {status:500})
  }
}
