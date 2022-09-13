import * as LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient()
const chain = 'mumbai'

const accessControlConditionsNFT = [
    {
      contractAddress: '0x1A3DAa1EBF7E9409e94D6dc5caDc7aCBbb8F0777',
      standardContractType: 'ERC1155',
      chain,
      method: 'balanceOf',
      parameters: [
        ':userAddress',
        '0',
      ],
      returnValueTest: {
        comparator: '>',
        value: '0'
      }
    }
  ]

class Lit {
  litNodeClient

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  async encryptString(str) {
    if (!this.litNodeClient) {
      await this.connect()
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str)

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditionsNFT,
      symmetricKey,
      authSig,
      chain,
    })

    return {
      encryptedFile: encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    }
  }

  async decryptString(encryptedStr, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect()
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditionsNFT,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig
    })
    const decryptedFile = await LitJsSdk.decryptString(
      encryptedStr,
      symmetricKey
    );
    
    return decryptedFile;
  }
}

export default new Lit()