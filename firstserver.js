const fs=require('fs');
const http=require('http');
const url=require('url');
const slugify=require('slugify');
console.log(slugify('fresh avocados',{lowercase:true}));
const replacetemplate=require('./modules/replaceTemplate');
const tempOverview=fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const card=fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const tempproduct=fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
    const dataObject=JSON.parse(data);            
    const slugs=dataObject.map(el=>{
        slugify(el.productName,{lower:true})
    })
const server=http.createServer((req,res)=>{
    //console.log(url.parse(req.url,true));

    const {query ,pathname}=url.parse(req.url,true);

   //overview
    if (pathname==='/'||pathname==='/overview'){
        
        res.writeHead(200,{'Content-Type':'text/html'});
        const cardsHtml=dataObject.map((el)=> replacetemplate(card,el)).join('');        
        const output=tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
        res.end(output);
    }
    else if(pathname==='/product'){
        res.writeHead(200,{'Content-Type':'text/html'})
        const product=dataObject[query.id];
        const output=replacetemplate(tempproduct,product)
        res.end(output);
    }
    else if(pathname==='/api'){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(data);
    }
    else {
    res.writeHead(404,{
        'Content-Type':'text/html',
        'my-own-header':'Hello-world'
        
    });    
    res.end('<h1>Page not found!</h1>')
    }
});
server.listen(8011,'127.0.0.1',()=>{
    console.log('Listening to requests on port 8011');
    });

    /*function replacetemplate(temp,product){
        let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
        output=output.replace(/{%IMAGE%}/g,product.image);
        output=output.replace(/{%PRICE%}/g,product.price);
        output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
        output=output.replace(/{%QUANTITY%}/g,product.quantity);
        output=output.replace(/{%DESCRIPTION%}/g,product.description);
        output=output.replace(/{%ID%}/g,product.id);
        if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');1
        return output;
    }*/