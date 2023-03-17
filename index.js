const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const app = express();
const morgan=require('morgan');
const Cotizacion=require("./config.js")

require("dotenv").config();
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


/*const docRef = db.collection('cotizaciones').doc('alovelace');
docRef.set({
  tabla: '<tabla>',
});*/


async function start() {
  const cotizacionesDoc = await Cotizacion.get();

  /*cotizacionesDoc.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });*/

  //console.log(await Cotizacion.doc("HLl1RvwH3ikCWqfWXAM6").get())
  //const pruebaAgregar = await Cotizacion.doc("1").set({id: "3", tabla: "otra"})
  /*Cotizacion.doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA"
})*/

  

}



const prueba = async () => {
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
        let tabla = "<table>"
        
        const trs = document.querySelectorAll('table tr')

        var diaCotizacion = []
        var arrayTd = []
        trs.forEach(element => {
            tabla = tabla + "<tr>"
            tds = element.querySelectorAll("td")
            if(tds.length>0){
                arrayTd = []
                tds.forEach(element2 => {
                    if(element2.innerText != "-"){
                        arrayTd.push(element2.innerText);
                        tabla = tabla + "<td>" + element2.innerText + "</td>"
                    }
                });
                diaCotizacion.push(arrayTd)     
            }
            tabla = tabla + "</tr>"
        });

        tabla = tabla + "</tabla>"

        const json = JSON.stringify(diaCotizacion);
       
        //return diaCotizacion
        return tabla;
      });


      
    
     /*await fs.writeFileSync('db/data.txt', data, err => {
        if (err) {
          console.error(err);
        }
      
      });
    */

      Cotizacion.doc("1").update({
        tabla: data
      });

    await browser.close();

    return data

};

app.get('/',  async  (req, res) => {    
 
  (async () => {
    const tablaDB = await Cotizacion.doc("1").get()
    res.send(tablaDB.data()["tabla"])
    await prueba()
   
  })()
   
})

app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
  
});