import { useRef, useEffect } from "react";
import { authenticateCeramic, createDocument, loadDocument } from "./scripts/Ceramic";
import client from "./scripts/Lit";

function App() {
  let inputRef = useRef(null);
  let outputRef = useRef(null);
  let docIdRef = useRef(null);

  const encrypt = async () => {
    const str = inputRef.current.value;
    const { encryptedFile, encryptedSymmetricKey } = await client.encryptString(
      str
    );
    docIdRef.current = await createDocument({
      encryptedFile,
      encryptedSymmetricKey,
    });
    outputRef.current.innerText =
      "Encrypted and saved to Ceramic: " + docIdRef.current;
  };

  const decrypt = async () => {
    const doc = await loadDocument(docIdRef.current);
    console.log(doc);
    const decryptedFile = await client.decryptString(
      doc.content.encryptedFile,
      doc.content.encryptedSymmetricKey
    );
    outputRef.current.innerText = "Output: " + decryptedFile;
  };

  useEffect(() => {
    authenticateCeramic();
  }, []);

  return (
    <div>
      <textarea ref={inputRef}></textarea>
      <p ref={outputRef}></p>
      <button onClick={encrypt}>Encrypt</button>
      <button onClick={decrypt}>Decrypt</button>
    </div>
  );
}

export default App;
