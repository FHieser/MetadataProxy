const contractProvider = require('./contracts/UnrealMfer.js');
const ethers = require('ethers');
const axios = require('axios');

const metadata = [];
var isReady = false;

//Fetching the Metadata of the chosen Contract
async function setup() {
  console.log("Fetch Metadata started.")
  /*
    Using the Ethers default provider for Blockchain Interaction
    NOTE: Because were using the default provider we get this message.
    -> The default API keys for each service are provided as a highly-throttled, community resource for low-traffic projects
    As we just make a single request with this provider that should work fine
  */
  const provider = ethers.getDefaultProvider();
  let contract = contractProvider.getContract(provider);

  let totalSupply = await contract.maxSupply();
  let firstTokenURI = await contract.tokenURI(0);


  /*
    This regex statement checks if the returned URI of the token is correctly hosted on ipfs
    additionally it allows for the extraction of the ipfs spcifiy Uri that starts with Qm (Dont know how that one is called)
  */
  let regexp = /^ipfs:\/\/(Qm.+\/)\d.json$/g;
  let match = regexp.exec(firstTokenURI);

  if (match != null) {
    //Extracts the ipfs spcifiy Uri that starts with Qm
    let ifpsUri = match[1];

    //For each token id of the contract
    for (let id = 0; id <= totalSupply; id++) {
      //Had some reliability issues of the ifps calls, so trying 3 times for the fetch seemed reasonable
      for (let tries = 0; tries < 3; tries++) {
        try {
          /*
            Constructiong the correct Link for the current Token to fetch the Metadata
            After some testing i decided to use the moralis ipfs gateway to fetch the data
            Was faster and more reliable than other gateways 
          */
          let ifpsLink =
            "https://gateway.moralisipfs.com/ipfs/" + ifpsUri + id + ".json";

          //Simple GET fetch that adds the returned metadata to the const
          await axios.get(ifpsLink).then((response) => (metadata[id] = { tokenId: id, metadata: response.data }));
          console.log("Metadata done for id: ", id);
          break;
        } catch (error) {
          console.log("Id failed: ", id);
        }
      }

    }
    console.log("Proxy Ready.");
    //When the fetching of the data is finished switching to ready
    isReady = true;
  }
  else {
    console.log("The given URL seems to not be hosted on the ipfs network.")
  }
}


function fetchAllMetadata() {
  console.log("Fetching all data.")
  return metadata;
}


function isProxyReady() {
  return isReady;
}


function fetchMetadataOfToken(TokenID) {
  console.log("Fetching data of ID: ", TokenID)
  return metadata[TokenID];
}

function isTokenInMetadata(TokenID) {
  return metadata.length >= TokenID;
}

//Allows the usage of the function outside of the .js file
exports.fetchAllMetadata = fetchAllMetadata;
exports.fetchMetadataOfToken = fetchMetadataOfToken;
exports.isTokenInMetadata = isTokenInMetadata;
exports.isProxyReady = isProxyReady;
exports.setup = setup;
