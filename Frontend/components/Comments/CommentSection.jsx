import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import CommentCard from "./CommentCard"

const supabase = createClient(
   import.meta.env.VITE_SUPABASE_URL,
   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

function CommentSection({ postId, currentUserId }) {

   const [comments, setComments] = useState([])
   const [content, setContent] = useState("")
   const [loading, setLoading] = useState(true)

   // -----------------------------
   // FETCH COMMENTS (with users)
   // -----------------------------
   async function fetchComments() {
      try {
         const { data, error } = await supabase
            .from("comments")
            .select(`
               id,
               content,
               post_id,
               user_id,
               created_at,
               users (
                  username
               )
            `)
            .eq("post_id", Number(postId))
            .order("created_at", { ascending: true })

         if (error) throw error

         setComments(data || [])

      } catch (error) {
         console.error("Error fetching comments:", error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchComments()
   }, [postId])

   // -----------------------------
   // SUBMIT COMMENT (INSERT FIXED)
   // -----------------------------
   async function submitComment() {

      if (!content.trim()) return

      try {
         const { data, error } = await supabase
            .from("comments")
            .insert([
               {
                  post_id: Number(postId),
                  content: content,
                  user_id: currentUserId
               }
            ])
            .select(`
               id,
               content,
               post_id,
               user_id,
               created_at,
               users (
                  username
               )
            `)
            .single()

         if (error) throw error

         setComments(prev => [...prev, data])
         setContent("")

      } catch (error) {
         console.error("Error posting comment:", error)
      }
   }

   // -----------------------------
   // UI
   // -----------------------------
   return (
      <div className="comment-section">

         <h2>Comments</h2>

         <div className="comment-input">

            <textarea
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="Write a comment..."
            />

            <button onClick={submitComment}>
               Send
            </button>

         </div>

         {loading ? (
            <p>Loading comments...</p>
         ) : (
            <div className="comment-list">

               {comments.map(comment => (
                  <CommentCard
                     key={comment.id}
                     comment={comment}
                  />
               ))}

            </div>
         )}

      </div>
   )
}

export default CommentSection