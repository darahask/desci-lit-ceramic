import { base64StringToBlob, blobToBase64String } from "lit-js-sdk";
import { useRef, useEffect } from "react";
import {
  authenticateCeramic,
  createDocument,
  loadDocument,
} from "./scripts/Ceramic";
import client from "./scripts/Lit";

function App() {
  let inputRef = useRef(null);
  let outputRef = useRef(null);
  let docIdRef = useRef(null);
  const chain = "mumbai";

  const mintNFT = async () => {};

  const encrypt = async () => {
    const accessControlConditionsNFT = [
      {
        contractAddress: "0x1A3DAa1EBF7E9409e94D6dc5caDc7aCBbb8F0777",
        standardContractType: "ERC1155",
        chain,
        method: "balanceOf",
        parameters: [":userAddress", "0"],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
    const { encryptedFile, encryptedSymmetricKey } = await client.encryptString(
      inputRef.current.value,
      accessControlConditionsNFT
    );
    docIdRef.current = await createDocument({
      encryptedFile: await blobToBase64String(encryptedFile),
      encryptedSymmetricKey,
      accessControlConditionsNFT,
    });
    outputRef.current.innerText =
      "Encrypted and saved to Ceramic: " + docIdRef.current;
  };

  const decrypt = async () => {
    const doc = await loadDocument(docIdRef.current);
    console.log("HEY HEY", doc.content);
    const decryptedFile = await client.decryptString(
      base64StringToBlob(doc.content.encryptedFile),
      doc.content.encryptedSymmetricKey,
      doc.content.accessControlConditionsNFT
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
