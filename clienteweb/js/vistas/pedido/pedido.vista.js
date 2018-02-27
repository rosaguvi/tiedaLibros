var vista = null;
var pedidoVista = {

    init:function () {
        vista.referenciarObjetos();
        vista.referenciarControles();
        vista.asignarEventos();
        vista.renderTemplatePedido = vista.obtenerTemplatePedido();
        vista.cargarPedido();
    /*
        vista.consultarAutores();
        vista.consultarLibros();

    */

    },

	referenciarObjetos:function(){
		vista.control = pedidoControl;
		vista.modelo = pedidoModelo;
	},

	referenciarControles:function(){
        vista.contenedorPedido = $('#contenedor-pedido');
	},

	asignarEventos:function(){

	},

    cargarPedido:function(){

        var carrito = JSON.parse( sessionStorage.getItem('carrito'));
        console.log(carrito) ;
        vista.contenedorPedido.empty();
        var items = $(vista.renderTemplatePedido({libros:carrito}));
        vista.contenedorPedido.append( items );

    },

    obtenerTemplatePedido:function(){
        return Handlebars.compile( $('#tpl-pedido').html() );
    },



};

vista = pedidoVista;
vista.init();