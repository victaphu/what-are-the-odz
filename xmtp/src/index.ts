//Importing project dependancies that we installed earlier
import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { getClientSignature, getMessages, newGroup } from './chat/createClient';
import { register } from 'module';

//App Varaibles 
dotenv.config()

//intializing the express app 
const app = express();

//using the dependancies
app.use(helmet());
app.use(cors());
app.use(express.json())

//exporting app
module.exports = app

const PORT = process.env.PORT || 3000

//Listing to the app and running it on PORT 5000
app.listen(PORT, async () => {
  console.log(`listning on port ${PORT}`)
})

app.post('/clientSignatureText', async (req, res) => {
  const { address } = req.body;
  const signatureText = await getClientSignature(address);
  res.json({ signatureText });
});

app.post('/register', async (req, res) => {
  const { address, signature } = req.body;

  const result = await register(address, signature);

  res.json({ result });
})

app.post('/postMessage', async (req, res) => {
  const { address, topic, content } = req.body;

  const result = await postMessage(address, topic, content);

  res.json({ result });
})

app.post('/getMessages', async (req, res) => {
  const { address, } = req.body;

  const result = await getMessages(address);

  res.json({ result });
})

app.post('/newGroup', async (req, res) => {
  const { address, groupAddresses } = req.body;

  const result = await newGroup(address, groupAddresses);

  res.json({ result });
})
