import { useEffect, useState } from "react"

import CommentCard from "./CommentCard"

function CommentSection({ postId }) {

   const [comments, setComments] = useState([])
   const [content, setContent] = useState("")

   async function fetchComments() {

      const response = await fetch(
         `http://localhost:3000/api/comments/post/${postId}`
      )

      const data = await response.json()

      setComments(data)
   }

   async function submitComment() {

      if (!content.trim()) {
         return
      }

      await fetch(
         "http://localhost:3000/api/comments",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               post_id: postId,
               user_id: 1,
               content
            })
         }
      )

      setContent("")

      fetchComments()
   }

   useEffect(() => {
      fetchComments()
   }, [postId])

   return (
      <div className="comment-section">

         <h2>Comments</h2>

         <div className="comment-input">

            <textarea
               value={content}
               onChange={(e) =>
                  setContent(e.target.value)
               }
               placeholder="Write a comment..."
            />

            <button onClick={submitComment}>
               Send
            </button>

         </div>

         <div className="comment-list">

            {comments.map(comment => (
               <CommentCard
                  key={comment.id}
                  comment={comment}
               />
            ))}

         </div>

      </div>
   )
}

export default CommentSection