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



async function scrape() {
    const browser = await puppeteer.launch({ 
      headless: true,
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
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.rava.com/perfil/DOLAR%20MEP', {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
  });

    await page.waitForSelector('table');
    
    const data = await page.evaluate(() => {
        const tabla = document.getElementsByTagName("table")
        
        const trs = document.querySelectorAll('table tr')

        var diaCotizacion = []
        var arrayTd = []
        trs.forEach(element => {
            tds = element.querySelectorAll("td")
            if(tds.length>0){
                arrayTd = []
                tds.forEach(element2 => {
                    if(element2.innerText != "-"){
                        arrayTd.push(element2.innerText);
                    }
                });
                diaCotizacion.push(arrayTd)     
            }
       });

        //return diaCotizacion
        return tabla[0].innerHTML
      });


      
    //const json = JSON.stringify(data);

     await fs.writeFileSync('data.txt', data, err => {
        if (err) {
          console.error(err);
        }
      
      });
    

    await browser.close();

};

app.get('/',  async  (req, res) => {    

    try {
      const data = fs.readFileSync('data.txt', 'utf8');

      res.send("<table>" + data + "</table>")
      //res.json(data);
    } catch (err) {
    
      res.json(err);
    }
   
})

app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
    scrape()
});