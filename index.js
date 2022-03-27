const express = require('express');
const app = express();
const port = 8081;
const getItemList = require('./services/listItemService')
const getCategoryList = require('./services/listCategorySubCategoryService.js');
const getSubCategoryList = require('./services/listCategorySubCategoryService.js');
const db = require('./queries/queries')

const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');


dotenv.config();
console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
app.use(express.json());

const users = [];

const cors = require("cors");

//methods
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.static(path.join(__dirname, '/build')));
//##googleLogin##
function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

app.post('/api/google-login', async (req, res) => {
  let token  = req.body.token;
  console.log(token)
  //token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU4YjQyOTY2MmRiMDc4NmYyZWZlZmUxM2MxZWIxMmEyOGRjNDQyZDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMzg5MzYzMDE0ODY3LWl2ZXFtYTUzczRvcTNrM2ttZHFqMGVkY2toc280ZThoLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMzg5MzYzMDE0ODY3LWl2ZXFtYTUzczRvcTNrM2ttZHFqMGVkY2toc280ZThoLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA0MTA1Nzc0ODI1NTM1NDM0MjE0IiwiZW1haWwiOiJvc2Nhci5yb25kbzEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiTHhja1FUUHdPY2Y3OWd4MUFxczllZyIsIm5hbWUiOiJPc2NhciBSb25kbyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQVRYQUp5a0ZVeEFBd1BaTXhZOGVla3NTZ1c5VVRSZ1pJYUlWU29md2I5NT1zOTYtYyIsImdpdmVuX25hbWUiOiJPc2NhciIsImZhbWlseV9uYW1lIjoiUm9uZG8iLCJsb2NhbGUiOiJlcyIsImlhdCI6MTY0ODA5ODcxOSwiZXhwIjoxNjQ4MTAyMzE5LCJqdGkiOiIzZDBjNTkzYzE1ZDZiMWFjMDQxMmE3YmY5NDEyNGU1N2RmODM2MWNlIn0.GaVqcMJfTOM-52eK3vM8PNNe1VRmgAekAY9XDB_Jsi2fZOI1NtD1j5OP26aVh4JpUv-MN8Z9cLBpaHsyStbuM9F7QmFR1vRCcOMWGgeyiopD0NpCeShJCrUDP1RQsUzR2XMyEWxmSJRCh93otLwUlwmeghQYm8tB4uokSzv4QqB3kL-OHMB_ZUQSOP606gSmsUHChiQ-NEN_crOMUB0lGqhvgDgR7_60Z7tQJ1CAbfNmmj5yeenFJcoyhTTpvia8e2LI3-ERlQdZe9eGN2onel7cNSy-DMHyAxuKyKQQAWBD82H8j6MQ1FJrqeh06ljRyBaLRgjcpvKnnOll2D83nQ"
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201);
  console.log(name)
  res.json({ name, email, picture });
});


//##googleLogin##



//items endpoint
app.get('/items', async (req, res) => {
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const brand = req.query.brand;
    const price = req.query.price;
    const items = await getItemList.getItemList(category, subcategory, brand, price, res);
})

//categories endpoint +async
app.get('/categories', async (req, res) => {
    const category = req.query.category;
    const catSub = await getCategoryList.getCategoryList(res);
    //res.json(catSub)
})
//subcategories endpoint +async
app.get('/subcategories', async (req, res) => {
    const category = req.query.category;
    const subcategories = await getSubCategoryList.getSubCategoryList(category, res);
    //res.json(subcategories)
})

//app.get('/testcategory', db.getCategories)

//listan the backend in the port 8081
app.listen(port, () => {
    console.log('server running on ' + port);
})

