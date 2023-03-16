const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const app = express();
const morgan=require('morgan');
require("dotenv").config();
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
 


const content = 'Some content!';



const datos = async function scrape() {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        `--disable-gpu`,
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath()
        });

    const page = await browser.newPage();
    await page.goto('https://www.rava.com/perfil/DOLAR%20MEP');

    await page.waitForSelector('table');
    
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td'))
        return tds.map(td => td.innerText)
      });

    const json = JSON.stringify(data);

     await fs.writeFileSync('data.txt', json, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    
      //You will now have an array of strings
      //[ 'One', 'Two', 'Three', 'Four' ]
    console.log(data);

    await browser.close();

};

app.get('/', (req, res) => {    

    

    res.json(
        {
            "Title": datos
        }
    );
})

app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
    datos()
});