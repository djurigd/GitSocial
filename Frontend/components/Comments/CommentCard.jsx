function CommentCard({ comment }) {
   return (
      <div className="comment-card">

         <div className="comment-header">
            <strong>
               {comment.users?.username || "Unknown User"}
            </strong>
         </div>

         <div className="comment-content">
            {comment.content}
         </div>

      </div>
   )
}

export default CommentCard