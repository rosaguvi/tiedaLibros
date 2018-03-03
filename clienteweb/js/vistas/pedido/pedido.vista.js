var vista = null;
var pedidoVista = {

    init:function () {
        vista.referenciarObjetos();
        vista.referenciarControles();
        vista.asignarEventos();
        vista.renderTemplatePedido = vista.obtenerTemplatePedido();
        vista.cargarPedido();
    },

	referenciarObjetos:function(){
		vista.control = pedidoControl;
		vista.modelo = pedidoModelo;
	},

	referenciarControles:function(){
        var tblPedido = $('#tblPedidos');
        vista.contenedorPedido = tblPedido.find('tbody'); ;
	},

	asignarEventos:function(){

	},

    cargarPedido:function(){

        var carrito = JSON.parse( sessionStorage.getItem('carrito'));
        console.log(carrito) ;
        vista.contenedorPedido.empty();
        var items = $(vista.renderTemplatePedido({libros:carrito}));
        vista.contenedorPedido.append( items );

        if (carrito && carrito.length>0){
            vista.contenedorPedido.find('.btn-act').on('click', vista.actualizarPedido);
        }

    },

    actualizarPedido:function(){
        var btn = $(this);
        var index = btn.attr('data-id');
        carrito = JSON.parse( sessionStorage.getItem('carrito') );
        var cant = btn.parent().parent().find('input').val() ;

        carrito[index].cantidad = cant ;
        carrito[index].subTotal = carrito[index].precio * carrito[index].cantidad ;
        carrito[index].impuesto = carrito[index].subTotal * 0.19 ;
        carrito[index].total_precio = carrito[index].subTotal + carrito[index].impuesto  ;
        sessionStorage.setItem('carrito', JSON.stringify(carrito));

        location.reload();

    },

    obtenerTemplatePedido:function(){
        return Handlebars.compile( $('#tpl-pedido').html() );
    },



};

vista = pedidoVista;
vista.init();