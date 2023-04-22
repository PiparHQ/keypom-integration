const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const { initKeypom, createDrop, getEnv } = require("keypom-js");
const { KeyPair, keyStores, connect } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();

async function piparKeypomDrop(){
    const network = "testnet"
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

    let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    let nearConfig = {
        networkId: network,
        keyStore: keyStore,
        nodeUrl: `https://rpc.${network}.near.org`,
        walletUrl: `https://wallet.${network}.near.org`,
        helperUrl: `https://helper.${network}.near.org`,
        explorerUrl: `https://explorer.${network}.near.org`,
    };

    let near = await connect(nearConfig);
    const fundingAccount = await near.account('pipar-keypom.testnet');

    await initKeypom({
        near: near,
        network: "testnet"
    });

    const {keys} = await createDrop({
        account: fundingAccount,
        numKeys: 5,
        depositPerUseNEAR: "21",
        fcData: {
            methods: [
                [{
                    receiverId: "pipar-alpha-v19.testnet",
                    methodName: "new_store",
                    args: JSON.stringify({
                        prefix: "keypom-docs-demo.testnet",
                    }),
                    attachedDeposit: parseNearAmount("20")
                }]
            ]
        },
    });
    pubKeys = keys.publicKeys

    var dropInfo = {};
    const {contractId: KEYPOM_CONTRACT} = getEnv()
    for(var i = 0; i < keys.keyPairs.length; i++) {
        let linkdropUrl = formatLinkdropUrl({
            customURL: `https://testnet.mynearwallet.com/linkdrop/${KEYPOM_CONTRACT}/${keys.secretKeys[i]}`,
            secretKeys: keys.secretKeys[i]
        })
        dropInfo[pubKeys[i]] = linkdropUrl;
    }
    console.log('Public Keys and Linkdrops: ', dropInfo)
    console.log(`Keypom Contract Explorer Link: explorer.${network}.near.org/accounts/${KEYPOM_CONTRACT}.com`)

}
piparKeypomDrop()