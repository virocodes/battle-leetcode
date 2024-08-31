// components/CodeMirrorEditor.js
import { UnControlled as CodeMirror } from 'react-codemirror2';
import React, { useEffect, useRef } from 'react';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'

const CodeMirrorEditor = ({ code, setCode }) => {
  const editor = useRef()
  const wrapper = useRef()
  const editorWillUnmount = () => {
    editor.current.display.wrapper.remove()
    wrapper.current.hydrated = false
  }

  return (
    <CodeMirror
      ref={wrapper}
      value={code}
      options={{
        mode: 'javascript', // Change this to the mode you need
        theme: 'material', // Change this to the theme you prefer
        lineNumbers: true,
        readOnly: false,
        firstLineNumber: 1,
        lineWrapping: true,
        // extraKeys: { "Ctrl-Space": "autocomplete" },
        // foldGutter: true,
        // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      }}
      onChange={(editor, data, value) => {
      }}
      editorDidMount={(e) => editor.current = e}
      editorWillUnmount={editorWillUnmount}
      // onBeforeChange={(editor, data, value) => {
      //   setCode(value);
      // }}
      // editorDidMount={(editor) => {
      //   editor.setValue(code);
      //   editor.clearHistory();
      // }}
    />
  );
};

export default CodeMirrorEditor;
