var vista = null;
var compraVista = {

    init:function () {
        vista.referenciarObjetos();
        vista.referenciarControles();
        vista.asignarEventos();
        vista.renderTemplateCompra = vista.obtenerTemplateCompra();
        vista.cargarCompra();
    },

	referenciarObjetos:function(){
		vista.control = compraControl;
		vista.modelo = compraModelo;
	},

	referenciarControles:function(){
        var tblcompra = $('#tblCompras');
        vista.contenedorCompra = tblcompra.find('tbody');
	},

	asignarEventos:function(){

	},

    cargarCompra:function(){
        var carrito = JSON.parse( sessionStorage.getItem('pedidoPago'));
        console.log(carrito) ;
        vista.contenedorCompra.empty();
        var items = $(vista.renderTemplateCompra({libros:carrito}));
        vista.contenedorCompra.append( items );
    },


    obtenerTemplateCompra:function(){
        return Handlebars.compile( $('#tpl-compra').html() );
    },



};

vista = compraVista;
vista.init();