# MetadataProxy

## Project setup
```
npm install
```

### Run Project

Navigate to the folder, where the ->index.js<- file resides, then:
```
node .
```
### Access Service

The REST API is accessible with the port defined in the index.js file
A GET on the basic URL should do the trick
I tested it with Axios.
See below:
```
let someVariable;
axios.get("http://localhost:3333/")
.then(response=>this.someVariable=response.data.metadata)
```
