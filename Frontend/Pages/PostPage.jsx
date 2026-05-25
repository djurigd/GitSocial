import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import FileExplorer from "../components/project/FileExplorer"
import CodeViewer from "../components/project/CodeViewer"
import CommentSection from "../components/comments/CommentSection"

function PostPage() {

   const { id } = useParams()

   const [post, setPost] = useState(null)
   const [files, setFiles] = useState([])
   const [selectedFile, setSelectedFile] = useState(null)

   useEffect(() => {

      async function fetchPost() {

         const postRes = await fetch(
            `http://localhost:3000/api/posts/${id}` //placeholder
         )

         const postData = await postRes.json()

         setPost(postData)

         const filesRes = await fetch(
            `http://localhost:3000/api/files/post/${id}`//placeholder
         )

         const filesData = await filesRes.json()

         setFiles(filesData)

         if (filesData.length > 0) {
            setSelectedFile(filesData[0])
         }
      }

      fetchPost()

   }, [id])

   if (!post) {
      return <div>Loading...</div>
   }

   return (
      <div className="post-page">

         <div className="project-header">
            <h1>{post.title}</h1>
            <p>{post.description}</p>
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