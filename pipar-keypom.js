const path = require("path");
const homedir = require("os").homedir();
const { keyStores, connect, Account } = require("near-api-js");

const keypom = require("keypom-js");
const {
    initKeypom,
    getEnv,
    createDrop,
    addToBalance,
    withdrawBalance,
    parseNearAmount,
    formatLinkdropUrl
} = keypom;

// Input the account that will be the funder of the drops
const FUNDER_ACCOUNT_ID = "pipar-alpha-rust-v3.testnet";
// Pass in the network Id Testnet or Mainnet
const NETWORK_ID = "testnet";

async function addBalance ({amount}) {
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

    // .near-credentials in the local environment NEAR CLI being used to get the Funder ID secret key
    let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    // Network Config
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

    // Initialization of Keypom SDK
    await initKeypom({
        near: near,
        network: "testnet"
    });

    await addToBalance({
        account: fundingAccount,
        amountYocto: parseNearAmount(`${amount}`),
        amountNear: `${amount}`,
        successUrl: "",
    })
}

async function withdrawBal () {
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

    // .near-credentials in the local environment NEAR CLI being used to get the Funder ID secret key
    let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    // Network Config
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

    // Initialization of Keypom SDK
    await initKeypom({
        near: near,
        network: "testnet"
    });

    await withdrawBalance({
        account: fundingAccount,
    })
}

// The create Drop function for pipar smart contract
async function createPiparDrop({amount, methodCall, arguments}) {
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

    // .near-credentials in the local environment NEAR CLI being used to get the Funder ID secret key
    let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    // Network Config
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

    // Initialization of Keypom SDK
    await initKeypom({
        near: near,
        network: "testnet"
    });

    // The drop function used to creating pipar functional call drops. This creates linkdrop with 10 key uses instead of multiple. Each key use is preloaded with 22 NEAR to be able to make a call to the pipar smart contract. Custom data is also passed to the contract call which is the claimer ID in the receiver_id metadata field
    let {keys} = await createDrop({
        account: fundingAccount,
        numKeys: 1,
        config: {
            usesPerKey: 1,
            dropRoot: "pipar-alpha-rust-v3.testnet"
        },
        depositPerUseNEAR: `${amount}`,
        fcData: {
            methods: [
                [{
                    receiverId: "pipar-alpha-rust-v3.testnet",
                    methodName: `${methodCall}`,
                    args: JSON.stringify(arguments),
                    attachedDeposit: parseNearAmount(`${amount}`),
                    // successUrl: "https://www.pipar.xyz/"
                }]
            ]
        },
        useBalance: false,
        successUrl: "https://www.pipar.xyz"
    })

    console.log('public keys: ', keys.publicKeys);
    console.log('private keys: ', keys.secretKeys);

    var pubKeys = keys.publicKeys

    var dropInfo = {};
    // Gets the most recent Keypom contract id
    const {contractId: KEYPOM_CONTRACT} = getEnv()
    for(var i = 0; i < keys.keyPairs.length; i++) {
        // Formating the linkdrops
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

function create (amount, methodCall, arguments) {
    let val = {
        amount: amount,
        methodCall: methodCall,
        arguments: arguments,
    };

    return createPiparDrop(val)
}

function add (amount) {
    let val = {
        amount: amount,
    };

    return addBalance(val)
}

function withdraw () {
    return withdrawBal()
}


// create("10", "get_store_cost", {})
// add("10")
// withdraw()

