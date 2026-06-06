function FileExplorer({
   files,
   selectedFile,
   onSelect
}) {

   return (
      <div className="file-explorer">

         <h3>Files</h3>

         {files.map(file => (

            <div
               key={file.id}
               className={
                  selectedFile?.id === file.id
                     ? "selected-file"
                     : "file-item"
               }
               onClick={() => onSelect(file)}
            >
               {file.filename}
            </div>

         ))}

      </div>
   )
}

export default FileExplorer