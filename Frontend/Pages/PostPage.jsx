import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { createClient } from "@supabase/supabase-js"
import { Link } from "react-router-dom"

import FileExplorer from "../components/Project/FileExplorer"
import CodeViewer from "../components/Project/CodeViewer"
import CommentSection from "../components/Comments/CommentSection"
import Header from "../components/HeaderBar"

const supabase = createClient(
   import.meta.env.VITE_SUPABASE_URL,
   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

function PostPage() {

   const { id } = useParams()

   const [post, setPost] = useState(null)
   const [files, setFiles] = useState([])
   const [selectedFile, setSelectedFile] = useState(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {

      async function fetchPost() {
         try {

            const postId = Number(id)

            const { data: postData, error: postError } =
               await supabase
                  .from("posts")
                  .select(`
                     *,
                     users (
                        username
                     ),
                     post_tags (
                        tags (
                           name
                        )
                     )
                  `)
                  .eq("id", postId)
                  .single()
            if (postError) throw postError

            setPost(postData)

            const { data: filesData, error: filesError } =
               await supabase
                  .from("files")
                  .select("*")
                  .eq("post_id", postId)

            if (filesError) throw filesError

            setFiles(filesData)

            if (filesData.length > 0) {
               setSelectedFile(filesData[0])
            }

         } catch (error) {

            console.error("Error loading post:", error)

         } finally {

            setLoading(false)

         }
      }

      fetchPost()

   }, [id])

   if (loading) {
      return <div>Loading...</div>
   }

   if (!post) {
      return <div>Post not found.</div>
   }

   return (
      <div className="post-page">

         <Header />

         <div className="project-header">

            <h1>{post.title}</h1>

            <p>{post.description}</p>

            <p className="author">
               Posted by{" "}
               <Link
                  to={`/profile/${post.user_id}`}
                  className="author-link"
               >
                  {post.users?.username}
               </Link>
            </p>
            <div className="post-tags">

               {post.post_tags?.map((tagLink) => (

                  <span
                     key={tagLink.tags.name}
                     className="tag"
                  >
                     #{tagLink.tags.name} 
                  </span>

               ))}

            </div>
         </div>

         <div className="viewer-layout">

            <FileExplorer
               files={files}
               selectedFile={selectedFile}
               onSelect={setSelectedFile}
            />

            <CodeViewer
               file={selectedFile}
            />

         </div>

         <CommentSection postId={id} />

      </div>
   )
}

export default PostPage