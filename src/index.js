const express = require('express');
const { send } = require('express/lib/response');
const cors = require('cors')

const MetadataProxy = require('./MetadataProxy.js');

const app = express()
app.use(cors())
const port = 3000

MetadataProxy.setup();

app.get('/', async (req, res) => {
    if (MetadataProxy.isProxyReady()) {
        //if Query does not contain Address fail
        try {
            let data = await MetadataProxy.fetchMetadata()
            res.status(200).json({ metadata: data })
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