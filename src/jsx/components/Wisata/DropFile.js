import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import Drop from "react-dropzone-uploader";

const DropFile = () => {
   // specify upload params and url for your files
   // const getUploadParams = ({ meta }) => {
   //    return { url: "https://httpbin.org/post" };
   // };

   // called every time a file's `status` changes
   const handleChangeStatus = ({ meta, file }, status) => {
      console.log(status, meta, file);
   };

   // receives array of files that are done uploading when submit button is clicked
   const handleSubmit = (files) => {
      console.log(files.map((f) => f.meta));
   };

   return (
      <Drop
         // getUploadParams={getUploadParams}
         onChangeStatus={handleChangeStatus}
         onSubmit={handleSubmit}
         inputContent="Klik untuk menambahkan gambar"
         accept="image/*"
         styles={{
            dropzone: {
               minHeight: 200,
               maxHeight: 200,
               width: "90%",
               backgroundColor: "#f2f4fa",
               border: "1px dashed #DDDFE1",
               overflow: "hidden",
            },
            inputLabel: {
               color: "#7e7e7e",
               fontSize: "18px",
               fontWeight: "normal",
               backgroundColor: "#f2f4fa",
            },
         }}
      />
   );
};

export default DropFile;