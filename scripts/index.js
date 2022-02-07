const Productos= []
var Cart = {
    content: [], 
    owner: '',
    
    addToCart(obj){
        const indexVal = this.content.map(a => {return a.nombre}).indexOf(obj.nombre);
        if(indexVal === -1){
            this.content.push(obj)
        }
        else{
            this.content[indexVal].cantidad++; 
        }

    },
    setOwner(owner){
        this.owner = owner;
    },
    getTotal(){
        if (this.content.length == 0) return 0;
        let precioFinal = 0;

        for(const articulo of this.content){
            precioFinal += articulo.getTotal();
        }

        return precioFinal;
    },
    getLength(){
        if (this.content.length == 0) return 0;
        let cantidadProductos = 0;

        for(const articulo of this.content){
            cantidadProductos += articulo.cantidad;
        }

        return cantidadProductos;

    },

    removerProducto(nombreProducto){
        const indice = this.content.map((articulo) => {return articulo.nombre}).indexOf(nombreProducto)
        this.content.splice(indice, 1);
        crearTabla(this.content);
        refreshNumCart()
    },
    sumarStockInd(nombreProducto){
        const indice = this.content.map((articulo) => {return articulo.nombre}).indexOf(nombreProducto)
        this.content[indice].sumarStock();
        crearTabla(this.content);
        refreshNumCart()
    },
    restarStockInd(nombreProducto){
        const indice = this.content.map((articulo) => {return articulo.nombre}).indexOf(nombreProducto)
        if (!this.content[indice].restarStock()){
            this.removerProducto(nombreProducto);
        }
        crearTabla(this.content);
        refreshNumCart()
    }

} 

class Articulo{
    constructor (nombre, marca, urlImg , precio, stock){
        
        this.id = Math.round(Math.random()*999999);
        this.nombre = nombre;
        this.marca = marca;
        this.img = urlImg;
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.cantidad = 1; 
    }
    modStock(num){
        this.stock += num;

    }
    getTotal(){
        return this.precio * this.cantidad;
    }
    sumarStock(){
        this.cantidad++;
    }
    restarStock(){
        if (this.cantidad > 1){
            
            this.cantidad--;
            return true;
        }
        else{
            return false;
        }
    }
}
const URLGET = "scripts/database.json"

$.get(URLGET, generarArticulos);
function crearArticulos(articulos){
    for (const articulo of articulos){
        $(".articles-container").append(`<div class="item-container"><img src="${articulo.img}"><a>${articulo.nombre}</a><div class='btn-compra' id="boton-compra${articulo.id}">Comprar</div></div>`);
        $('.articles-container').on('click', `#boton-compra${articulo.id}`, function(){
            Cart.addToCart(articulo);
            refreshNumCart();
            crearTabla(Cart.content);
        })
        
    }
}
function refreshNumCart(){
    let numCart = document.querySelector('#num-carrito');
    numCart.innerText = Cart.getLength();
}
//boton para abrir carrito
$('.table').hide();

$('.boton-carro').on('click', function(){
    let text = "";
    if($('.boton-carro').text() === 'Mostrar Carrito'){
        crearTabla(Cart.content);
        $('.table').show(1000);
        text = 'Ocultar Carrito';
    }else{
        $('.table').hide(500);
        text = 'Mostrar Carrito';
    }

    $('.boton-carro').html(text);
})
 // va crear los articulos dentro del carrito.
function crearTabla(carrito){
    $('.cuerpo-tabla').html('');
    carrito.forEach((item,index) => {
        

        $('.cuerpo-tabla').append(`                <tr>
        <td><button onclick="Cart.removerProducto('${item.nombre}')" class="btn-close"></button></td>
        <td>${item.marca} ${item.nombre}</td>
        <td><button onclick="Cart.sumarStockInd('${item.nombre}')" class="btn btn-success btn-sm">+</button>${item.cantidad}<button onclick="Cart.restarStockInd('${item.nombre}')" class="btn btn-primary btn-sm">-</button></td>
        <td>${item.precio}</td>
        <td>$${item.getTotal()}</td>
      </tr>`)

    });
    $('.cuerpo-tabla').append(`                <tr>
    <td>Precio Total:</td>
    <td>$${Cart.getTotal()}</td>
</tr>
`)

}

function generarArticulos(productos, estado){
    if(estado === "success"){for (const producto of productos){
       
        const articuloNuevo =  new Articulo (producto.nombre, producto.marca, producto.urlImg, producto.precio, producto.stock);

        Productos.push(articuloNuevo); 
        
    }
    crearArticulos(Productos)
}
}
