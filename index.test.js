
import minimist from 'minimist';
import {Productos} from './src/services/productos.services.js';

const productosAPI = new Productos()


async function ejecutarCMD() {
    const argv = minimist(process.argv.slice(2));
    const { cmd, name, price, thumbnail } = argv;

    try {
        switch (cmd.toLowerCase()) {
            case 'Agregar':
                console.log(cmd)
                console.log(await productosAPI.saveProductos({
                    producto: {
                        name: name,
                        price: price,
                        thumbnail: thumbnail,
                    }
                }))
                break
        }
    } catch (err) {
        console.log(err)
    }
    productosAPI.exit()
}


ejecutarCMD()
