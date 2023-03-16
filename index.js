const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const app = express();
const morgan=require('morgan');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
 


const content = 'Some content!';



(async function scrape() {
    const browser = await puppeteer.launch({ headless: false });

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

})();

app.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo"
        }
    );
})

app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});