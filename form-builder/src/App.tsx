import React from 'react';
import FormEditor from './FormEditor';

const App = () => {
  const handleSave = (xml: any, form: any) => {
    // Implement your logic to save the form data
    console.log('Form saved:', form);
  };

  return (
    <div>
      <h1>Form Editor</h1>
      <FormEditor onSave={handleSave} />
    </div>
  );
};

export default App;