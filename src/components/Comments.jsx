"use client";

import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CommentForm from "./CommentForm";
import CommentData from "./CommentData";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateCommentCount = (commentArray) => {
    let count = commentArray.length;
    commentArray.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length;
      }
    });
    return count;
  };

  useEffect(() => {
    async function loadComments() {
      try {
        const response = await fetch(`/api/getcomments?postId=${postId}`);
        const initialComments = await response.json();

        if (Array.isArray(initialComments)) {
          setComments(initialComments);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Failed to load comments", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [postId]);

  const addReply = async (parentId, content) => {
    try {
      const response = await fetch(`/api/postcomments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content, parentId }),
      });

      if (response.ok) {
        const newComment = await response.json();
        const updateReplies = (comments, parentId, newComment) => {
          return comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            } else if (comment.replies?.length) {
              return {
                ...comment,
                replies: updateReplies(comment.replies, parentId, newComment),
              };
            } else {
              return comment;
            }
          });
        };
        setComments((prevComments) =>
          updateReplies(prevComments, parentId, newComment)
        );
      } else {
        console.error("Failed to submit reply");
      }
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  };

  // const deleteComment = async (commentId) => {
  //   try {
  //     const response = await fetch(`/api/deletecomment`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ commentId }),
  //     });
  //     if (response.ok) {
  //       setComments((prevComments) =>
  //         prevComments.filter((comment) => comment.id !== commentId)
  //       );
  //     } else {
  //       console.error("Failed to delete comment");
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete comment", error);
  //   }
  // };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/deletecomment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });
      if (response.ok) {
        const removeCommentById = (comments, commentId) => {
          return comments
            .map((comment) => {
              if (comment.id === commentId) {
                return null;
              }

              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply.id !== commentId
                  ),
                };
              }

              return comment;
            })
            .filter((comment) => comment !== null);
        };

        setComments((prevComments) =>
          removeCommentById(prevComments, commentId)
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const editComment = async (commentId, content) => {
    console.log(commentId)
    console.log(content)
    try {
      const response = await fetch(`/api/editcomments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, content }),
      });

      if (response.ok) {
        await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, content } : comment
          )
        );
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const handleSubmitComment = async (content) => {
    try {
      const response = await fetch(`/api/postcomments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const commentCount = calculateCommentCount(comments);

  return (
    <div className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Comments {commentCount > 0 && `(${commentCount})`}
      </h2>
      <CommentForm handleSubmitComment={handleSubmitComment} />

      {loading ? (
        <div className="flex justify-center my-6">
          <CircularProgress />
        </div>
      ) : (
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentData
                key={comment.id}
                comment={comment}
                addReply={addReply}
                deleteComment={deleteComment}
                editComment={editComment}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
