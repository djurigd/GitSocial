function CommentCard({ comment }) {

   return (
      <div className="comment-card">

         <div className="comment-header">
            <strong>User {comment.user_id}</strong>
         </div>

         <div className="comment-content">
            {comment.content}
         </div>

      </div>
   )
}

export default CommentCard