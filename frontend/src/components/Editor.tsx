import React, { useState } from 'react';
import ReactQuill from 'react-quill-new/lib';
import 'react-quill-new/dist/quill.snow.css';

const Editor: React.FC<{
  value?: string
  setValue: (value: string) => void;
}> = ({ value, setValue }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={e => setValue(e)}
      className='w-[80%] h-[250px]'
    />
  );
}

export default Editor;
