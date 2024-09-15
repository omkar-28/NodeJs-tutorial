/*******************************
BASICS OF NODE JS WITH PRODUCTS LISTING EXAMPLES
********************************/

// const readLine = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceHtml = require('./Modules/replaceHtml');
// const rl = readLine.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.question("Please enter your name: ", function (name) {
//     console.log("you entered " + name);
//     rl.close();
// })

// rl.on('close', () => {
//     console.log("interfaces closed");
//     process.exit(0);
// });

// Read a file using fs.readFile()
// fs.readFile('./files/start.txt', 'utf-8', (err, data) => {
//     console.log(data);

//     fs.readFile(`./files/${data}.txt`, 'utf-8', (err, data1) => {
//         console.log(data1);

//         fs.readFile(`./files/output.txt`, 'utf-8', (err, data2) => {
//             console.log(data2);
//         });
//     });
// });

// fs.writeFileSync('./files/output.txt', `Hello world!, data read from input.txt: ${textIn} \nDate created: ${new Date().toLocaleDateString()}`);

// console.log("Reading file...");

/**** Creating Server ****/
const html = fs.readFileSync('./public/templates/index.html', 'utf-8');
const productsObj = JSON.parse(fs.readFileSync('./Data/products.json', 'utf-8'));
const productListHtml = fs.readFileSync('./public/templates/product-list.html', 'utf-8');
const productDetailHtml = fs.readFileSync('./public/templates/product-details.html', 'utf-8');

// const server = http.createServer(function (req, res) {
//     let { query, pathname: path } = url.parse(req.url, true)
//     // let path = req.url;

//     if (path === '/' || path.toLocaleLowerCase() === '/home') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//             'my-header': 'Custom Headers',
//         });
//         res.end(html.replace('{{%CONTENT%}}', replaceHtml(productListHtml, productsObj[0])));
//     } else if (path.toLocaleLowerCase() === '/about') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//             'my-header': 'Custom Headers',
//         });
//         res.end(html.replace('{{%CONTENT%}}', 'You are in about page'));
//     } else if (path.toLocaleLowerCase() === '/contact') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//             'my-header': 'Custom Headers',
//         });
//         res.end(html.replace('{{%CONTENT%}}', 'You are in contact page'));
//     } else if (path.toLowerCase() === '/products') {
//         if (!query.id) {
//             let productHtmlArray = productsObj.map((prod) => {
//                 return replaceHtml(productListHtml, prod);
//             })
//             let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(''));
//             res.writeHead(200, { 'Content-Type': 'text/html' });
//             res.end(productResponseHtml);
//         } else {
//             let prod = productsObj[query.id]
//             let productDetailResponseHtml = replaceHtml(productDetailHtml, prod);
//             res.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));
//         }
//     } else {
//         res.writeHead(404, {
//             'Content-Type': 'text/html',
//             'my-header': 'Custom Headers',
//         });
//         res.end(html.replace('{{%CONTENT%}}', 'Error 404: Page Not Found'));
//     }
// });

const server = http.createServer();

server.on('request', (req, res) => {
    let { query, pathname: path } = url.parse(req.url, true)
    // let path = req.url;

    if (path === '/' || path.toLocaleLowerCase() === '/home') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Custom Headers',
        });
        res.end(html.replace('{{%CONTENT%}}', replaceHtml(productListHtml, productsObj[0])));
    } else if (path.toLocaleLowerCase() === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Custom Headers',
        });
        res.end(html.replace('{{%CONTENT%}}', 'You are in about page'));
    } else if (path.toLocaleLowerCase() === '/contact') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Custom Headers',
        });
        res.end(html.replace('{{%CONTENT%}}', 'You are in contact page'));
    } else if (path.toLowerCase() === '/products') {
        if (!query.id) {
            let productHtmlArray = productsObj.map((prod) => {
                return replaceHtml(productListHtml, prod);
            })
            let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(''));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(productResponseHtml);
        } else {
            let prod = productsObj[query.id]
            let productDetailResponseHtml = replaceHtml(productDetailHtml, prod);
            res.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));
        }
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-header': 'Custom Headers',
        });
        res.end(html.replace('{{%CONTENT%}}', 'Error 404: Page Not Found'));
    }
});

// Start the server
server.listen(8080, 'localhost', () => {
    console.log("server listening on 4000");
});