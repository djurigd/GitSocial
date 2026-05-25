import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import FileExplorer from "../components/Project/FileExplorer"
import CodeViewer from "../components/Project/CodeViewer"
import CommentSection from "../components/Comments/CommentSection"
import Header from "../components/HeaderBar"

function PostPage() {

   const { id } = useParams()

   const [post, setPost] = useState(null)
   const [files, setFiles] = useState([])
   const [selectedFile, setSelectedFile] = useState(null)

   useEffect(() => {
      // Mock post + files data for local testing
      const mockPost = {
         id: 1,
         title: "Test post",
         description: "This is the description of the test post. It can be a project, an article, or anything else you want to share with the community."
      }

      const mockFiles = [
         {
            id: 1,
            filename: "App.jsx",
            language: "javascript",
            content: `function App() {
   return (
      <h1>Hello World</h1>
   )
}
export default App`
         },

         {
            id: 2,
            filename: "styles.css",
            language: "css",
            content: `body {
   background-color: black;
   color: white;
}`
         },

         {
            id: 3,
            filename: "server.js",
            language: "javascript",
            content: `const express = require('express')

const app = express()

app.listen(3000)`
         }
      ]

      setPost(mockPost)
      setFiles(mockFiles)
      setSelectedFile(mockFiles[0])

   }, [id])

   if (!post) {
      return <div>Loading...</div>
   }
   return (
      <div className="post-page">

         <Header />

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