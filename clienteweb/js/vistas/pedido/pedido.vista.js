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
        vista.contenedorPedido = tblPedido.find('tbody');
        vista.btnconfirmar = $('#btnConfirmarPedido');
        vista.btnconpagar = $('#btnPagar');
	},

	asignarEventos:function(){
        vista.btnconpagar.on('click', vista.realizarPago);
	},

    realizarPago:function(){
        if (sessionStorage.getItem('carrito'))
        {
            var carrito = [] ;
            var libro = [] ;
            var pedidoPago   = [] ;
            var cantidad = 0 ;
            var subtotal = 0 ;
            var impuesto = 0 ;
            var total = 0 ;
            var contador = 0 ;
            carrito = JSON.parse( sessionStorage.getItem('carrito') );
            for (var j = 0 ; j< carrito.length ; j ++)
            {
                carrito[j];
                if(carrito[j].cantidad > 0 )
                {
                    cantidad = cantidad + carrito[j].cantidad ;
                    subtotal = subtotal +carrito[j].subTotal ;
                    impuesto = impuesto + carrito[j].impuesto  ;
                    total = total + carrito[j].total_precio  ;
                    pedidoPago.push(carrito[j]);
                    contador = contador +  1 ;
                }
            }
            if (contador > 0 )
            {
                libro = carrito[0] ;
                libro.nombre = 'Total Compra' ;
                libro.cantidad = cantidad ;
                libro.subTotal = subtotal ;
                libro.impuesto = impuesto ;
                libro.total_precio =  total ;
                console.log(libro) ;
                pedidoPago.push(libro);
                sessionStorage.setItem('pedidoPago', JSON.stringify(pedidoPago));
            }
        }
        sessionStorage.removeItem('carrito') ;
        __app.redireccionar(__app.rutas.VISTAS.RESUMEN_COMPRA);

    },

    cargarPedido:function(){

        var carrito = JSON.parse( sessionStorage.getItem('carrito'));
        vista.contenedorPedido.empty();
        var items = $(vista.renderTemplatePedido({libros:carrito}));
        vista.contenedorPedido.append( items );
        vista.btnconfirmar.attr("disabled", true);
        if (carrito && carrito.length>0){
            vista.btnconfirmar.attr("disabled", false);
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