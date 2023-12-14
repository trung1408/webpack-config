import React, { useRef, useEffect } from 'react';
import { FormEditor as FormEditorCore } from '@bpmn-io/form-js';

interface FormEditorProps {
  onSave: (xml: any, form: any) => void;
}

const FormEditor = ({ onSave }: FormEditorProps) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const formEditor = new FormEditorCore({
      container: editorRef.current,
    });

    console.log('formEditor', formEditor);

    formEditor.on('save', (event: any) => {
      const { xml, form } = event;

      // Handle form save (you can send the XML to your server or store it locally)
      console.log('Form XML:', xml);
      console.log('Form Data:', form);

      if (onSave) {
        onSave(xml, form);
      }
    });

    return () => {
      formEditor.destroy();
    };
  }, [onSave]);

  return <div ref={editorRef} style={{ height: '500px', border: '1px solid #ccc' }} />;
};

export default FormEditor;
