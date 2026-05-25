function CodeViewer({ file }) {

   if (!file) {
      return (
         <div className="code-viewer">
            Select a file
         </div>
      )
   }

   return (
      <div className="code-viewer">

         <div className="code-header">
            <span>{file.filename}</span>
         </div>

         <pre className="code-content">
            <code>
               {file.content}
            </code>
         </pre>

      </div>
   )
}

export default CodeViewer