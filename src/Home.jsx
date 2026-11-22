import Product from './components/Product'
const Home = () => {
    const products = [
        {
            id:1,
            category:"COMPUTER & ACCESSORIES",
            img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKcesuVhjhwBqU20SHryhcxa4OGoCXQ7EhAopF01DNw&s=10",
            name:"Dell",
            dis:"A powerful and reliable computer for work, study, and everyday use.",
            price: 200
        }
    ]
    return (
        <>
        {products.map((product) =>(
             <Product key={product.id} product={product}/>
        ))}

       
        </>
    )
}

export default Home
