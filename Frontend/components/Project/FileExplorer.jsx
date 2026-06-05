function FileExplorer({
   files,
   selectedFile,
   onSelect
}) {
   return (
      <div className="file-explorer">

         <h3>Files</h3>

         <div className="file-list">
            {files.map(file => {

               const isSelected = selectedFile?.id === file.id

               return (
                  <div
                     key={file.id}
                     onClick={() => onSelect(file)}
                     className={`file-item ${isSelected ? "active" : ""}`}
                  >
                     <div className="file-name">
                        {file.filename}
                     </div>

                     {/* optional metadata line */}
                     {file.storage_path && (
                        <div className="file-path">
                           {file.storage_path}
                        </div>
                     )}
                  </div>
               )
            })}
         </div>

      </div>
   )
}

export default FileExplorer