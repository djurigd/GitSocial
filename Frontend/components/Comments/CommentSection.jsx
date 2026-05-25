import { useEffect, useState } from "react"

import CommentCard from "./CommentCard"

function CommentSection({ postId }) {

   const [comments, setComments] = useState([])
   const [content, setContent] = useState("")

   useEffect(() => {
      // Mock comments for testing
      const mockComments = [
         { id: 1, user_id: 1, content: "This project is awesome!" },
         { id: 2, user_id: 2, content: "Really clean React structure." }
      ]

      setComments(mockComments)
   }, [postId])

   function submitComment() {
      if (!content.trim()) return

      const newComment = { id: Date.now(), user_id: 1, content }
      setComments(prev => [...prev, newComment])
      setContent("")
   }

   return (
      <div className="comment-section">
         <h2>Comments</h2>

         <div className="comment-input">
            <textarea
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="Write a comment..."
            />

            <button onClick={submitComment}>Send</button>
         </div>

         <div className="comment-list">
            {comments.map(comment => (
               <CommentCard key={comment.id} comment={comment} />
            ))}
         </div>
      </div>
   )
}

export default CommentSection