import React from 'react'
import XLSX from 'xlsx';

export default function Insert() {

   const handleFileUpload = (event) => {

     const file = event.target.files[0];
     if (!file) {
       alert('No file selected!');
       return;
     }

     const reader = new FileReader();

    //  reader.onload = event => {
    //    const data = new Uint8Array(event.target.result);
    //    const workbook = XLSX.read(data, { type: 'array' });

    //    const firstSheetName = workbook.SheetNames[0];
    //    const worksheet = workbook.Sheets[firstSheetName];
    //    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    //    console.log(jsonData);
    //    // You can set state with jsonData or perform other actions with it
    //  };

    //  reader.onerror = event => {
    //    console.error("File could not be read! Code " + event.target.error.code);
    //  };

    //  reader.readAsArrayBuffer(file);
   }
  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".xls,.xlsx" />

    </div>
  )
}
