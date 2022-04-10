const express = require('express');
const { send } = require('express/lib/response');
const cors = require('cors')

const MetadataProxy = require('./MetadataProxy.js');

const app = express()
app.use(cors())
const port = 3333

//Starting the setup of the Proxy
MetadataProxy.setup();

app.get('/', async (req, res) => {
    //Checks if the Proxy is ready
    if (MetadataProxy.isProxyReady()) {
        try {
            let data = await MetadataProxy.fetchMetadata()
            res.status(200).json({ metadata: data })
app.get('/getDataForToken', async (req, res) => {
    //Checks if the Proxy is ready
    if (MetadataProxy.isProxyReady()) {
        try {
            let TokenID = req.query.TokenID;
            if(MetadataProxy.isTokenInMetadata(TokenID)){
                let data = await MetadataProxy.fetchMetadataOfToken(TokenID)
                res.status(200).json({ data: data })
            }
            else{
                res.status(400).send({ message: "Metadata for TokenID is not available." })
                return
            }

            
        }
        catch (e) {
            console.log(e)
            res.status(500).send({ message: "Could not fetch Data." })
            return
        }
    }
    else{
        res.status(503).send({ message: "Proxy ist still booting up." })
    }

})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})