import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { createClient } from "@supabase/supabase-js"

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
   const [fileLoading, setFileLoading] = useState(false)

   async function loadFile(file) {

      try {

         setFileLoading(true)

         const { data, error } =
            await supabase.storage
               .from("project-files")
               .download(file.storage_path)

         if (error) throw error

         const content = await data.text()

         setSelectedFile({
            ...file,
            content
         })

      } catch (error) {

         console.error("Error loading file:", error)

      } finally {

         setFileLoading(false)

      }
   }

   useEffect(() => {

      async function fetchPost() {

         try {

            const postId = Number(id)

            const { data: postData, error: postError } =
               await supabase
                  .from("posts")
                  .select(`*,users (username),post_tags (tags (name))`)
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

            const firstFile = filesData.find(f => f.storage_path)

            if (firstFile) {
               await loadFile(firstFile)
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
               onSelect={loadFile}
            />

            {fileLoading ? (
               <div>Loading file...</div>
            ) : (
               <CodeViewer
                  file={selectedFile}
               />
            )}

         </div>

         <CommentSection postId={id} />

      </div>
   )
}

export default PostPage