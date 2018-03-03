var vista = null;
var catalogoVista = {

    init:function () {
        vista.referenciarObjetos();
        vista.referenciarControles();
        vista.asignarEventos();
        vista.consultarAutores();
        vista.consultarLibros();
        vista.renderTemplateLibros = vista.obtenerTemplateCatalogo();
    },

	referenciarObjetos:function(){
		vista.control = catalogoControl;
		vista.modelo = catalogoModelo;
	},

	referenciarControles:function(){
        vista.form = $('#formulario');
        vista.txtNombre = vista.form.find('#txtNombreLibro');
        vista.btnBuscarNombre = vista.form.find('#btnBuscarLibro');
        vista.btnLimpiar = vista.form.find('#btnLimpiar');
        vista.cmbAutores = vista.form.find('#cmbAutor');
        vista.contenedorCatalogo = vista.form.find('#contenedor-libros');
	},

	asignarEventos:function(){
        vista.txtNombre.on('keyup', vista.buscarPorNombre);
        vista.btnBuscarNombre.on('click', vista.buscarPorNombre);
        vista.cmbAutores.on('change', vista.buscarPorAutor);
        vista.btnLimpiar.on('click', vista.limpiarFiltros);
	},

    limpiarFiltros:function(){
        vista.txtNombre.val('');
        vista.cmbAutores.val('-1');
    },

    consultarAutores:function(){
        vista.control.consultarAutores(vista.onConsultarAutoresCompleto);
    },

    onConsultarAutoresCompleto:function(respuesta){
        vista.cmbAutores.llenarCombo(respuesta.data,'_id', 'nombre' );
    },

    consultarLibros:function(){
        vista.control.consultarTodos(vista.onConsultarLibrosCompleto);
    },

    onConsultarLibrosCompleto:function(respuesta){
        vista.modelo.libros = respuesta.data;
        console.log(respuesta.data) ;
        vista.contenedorCatalogo.empty();
        var items = $(vista.renderTemplateLibros({libros:respuesta.data}));
        vista.contenedorCatalogo.append( items );

        if (respuesta.data && respuesta.data.length>0){
            vista.contenedorCatalogo.find('.btn-detalles').on('click', vista.cargarDetallesLibro);
            vista.contenedorCatalogo.find('.btn-agregar').on('click', vista.agregarLibroCarrito);
        }
    },

    cargarDetallesLibro:function(){
        var btn = $(this);
        var idLibro = btn.attr('data-id');
        sessionStorage.setItem('libro', idLibro);
        btn.attr('target', '_blank');
        btn.attr('href' , __app.rutas.VISTAS.DETALLES_LIBRO.url) ;
        btn.click() ;
    },

    agregarLibroCarrito:function(){
        var btn = $(this);
        var idLibro = btn.attr('data-id');
        var carrito = [] ;
        var libro   = [] ;
        var contador = 0 ;
        for (var i=0; i< vista.modelo.libros.length ; i++){
            libro = vista.modelo.libros[i] ;
            if (libro._id == idLibro) {
                contador = 0 ;
                if (sessionStorage.getItem('carrito')){
                    carrito = JSON.parse( sessionStorage.getItem('carrito') );
                    for (var j = 0 ; j< carrito.length ; j ++)
                    {
                        carrito[j];
                        if(carrito[j]._id == idLibro)
                        {
                            carrito[j].cantidad = carrito[j].cantidad + 1 ;
                            carrito[j].subTotal = carrito[j].subTotal + libro.precio ;
                            carrito[j].impuesto = carrito[j].subTotal * 0.19 ;
                            carrito[j].total_precio = carrito[j].subTotal + carrito[j].impuesto  ;
                            contador = 1 ;
                        }
                    }
                }
                if (contador == 0 ) {
                    libro.cantidad =  1  ;
                    libro.subTotal = libro.precio ;
                    libro.impuesto = libro.subTotal * 0.19 ;
                    libro.total_precio = libro.subTotal + libro.impuesto  ;
                    carrito.push(libro);
                }
                sessionStorage.setItem('carrito', JSON.stringify(carrito));
            }
        }
    },

    buscarPorNombre:function(){
        var nombre = vista.txtNombre.val().trim();
        if (nombre.length === 0) {
            vista.consultarLibros();
            return;
        }
        if (nombre.length>=3) {
            vista.control.consultarPorNombre(nombre, vista.onConsultarLibrosCompleto);
            return;
        }
    },

    buscarPorAutor:function(){
        var idAutor = vista.cmbAutores.val();
        if (idAutor==='-1') {
            vista.consultarLibros();
            return;
        }
        vista.control.consultarPorAutor(idAutor, vista.onConsultarLibrosCompleto);
    },

    obtenerTemplateCatalogo:function(){
        return Handlebars.compile( $('#tpl-libro').html() );
    },

};

vista = catalogoVista;
vista.init();