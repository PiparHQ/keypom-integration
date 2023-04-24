const path = require("path");
const homedir = require("os").homedir();
const { keyStores, connect, Account } = require("near-api-js");

const keypom = require("keypom-js");
const {
    initKeypom,
    getEnv,
    createDrop,
    parseNearAmount,
    formatLinkdropUrl
} = keypom;

const FUNDER_ACCOUNT_ID = "pipar-keypom.testnet";
const NETWORK_ID = "testnet";
async function createPiparDrop() {
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

    let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    let nearConfig = {
        networkId: NETWORK_ID,
        keyStore: keyStore,
        nodeUrl: `https://rpc.${NETWORK_ID}.near.org`,
        walletUrl: `https://wallet.${NETWORK_ID}.near.org`,
        helperUrl: `https://helper.${NETWORK_ID}.near.org`,
        explorerUrl: `https://explorer.${NETWORK_ID}.near.org`,
    };

    let near = await connect(nearConfig);
    const fundingAccount = new Account(near.connection, FUNDER_ACCOUNT_ID)

    await initKeypom({
        near: near,
        network: "testnet"
    });

    let {keys} = await createDrop({
        account: fundingAccount,
        numKeys: 1,
        config: {
            usesPerKey: 10
        },
        depositPerUseNEAR: "22",
        fcData: {
            methods: [
                [{
                    receiverId: "pipar-alpha-v23.testnet",
                    methodName: "new_store",
                    args: JSON.stringify({
                        "metadata": {
                            "receiver_id": ""
                        }
                    }),
                    attachedDeposit: parseNearAmount("21"),
                    accountIdField: "metadata.receiver_id"
                }]
            ]
        },
    })

    console.log('public keys: ', keys.publicKeys);
    console.log('private keys: ', keys.secretKeys);

    var pubKeys = keys.publicKeys

    var dropInfo = {};
    const {contractId: KEYPOM_CONTRACT} = getEnv()
    for(var i = 0; i < keys.keyPairs.length; i++) {
        let linkdropUrl = formatLinkdropUrl({
            customURL: "https://testnet.mynearwallet.com/linkdrop/CONTRACT_ID/SECRET_KEY",
            secretKeys: keys.secretKeys[i]
        })
        dropInfo[pubKeys[i]] = linkdropUrl;
    }

    console.log('Pipar public Keys and Linkdrops: ', dropInfo)
    console.log(`Keypom Contract Explorer Link: explorer.${NETWORK_ID}.near.org/accounts/${KEYPOM_CONTRACT}.com`)


    // return keys
}

createPiparDrop()

