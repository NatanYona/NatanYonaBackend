import db from '../../firebase.config'


//get all products from db

export const getProducts = async () => {
    const products = []
    const querySnapshot = await db.collection('productos').get()
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() })
    })
    return products
}
