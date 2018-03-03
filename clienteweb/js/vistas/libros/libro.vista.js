var vista = null;
var libroVista = {

    init:function () {
        vista.referenciarObjetos();
        vista.referenciarControles();
        vista.asignarEventos();
        vista.id_libro = sessionStorage.getItem('libro') ;
        vista.consultarLibro(vista.id_libro) ;
    },

    referenciarObjetos:function(){
        vista.control = libroControl;
        vista.modelo = libroModelo;
    },

    referenciarControles:function(){
        vista.tarjeta = $('#formulario');
        vista.titulo =  $('.titulo-libro');
        vista.btnAgregar = $('#btnAgregar');
    },

    asignarEventos:function(){
        vista.btnAgregar.on('click', vista.agregarLibroCarrito);
    },

    consultarLibros:function(){
        vista.control.consultarTodos(vista.onConsultarLibrosCompleto);
    },

    onConsultarLibrosCompleto:function(respuesta){
        vista.modelo.libros = respuesta.data;
    },

    consultarLibro:function(id_libro){
        vista.control.consultarPorId(id_libro, vista.onConsultarLibroCompleto);
    },

    onConsultarLibroCompleto:function(respuesta){

        vista.modelo.libros = respuesta.data ;

        var libro = respuesta.data;

        vista.tarjeta.find('#imageLibro').attr('src' ,libro.portada );
        vista.titulo.text(libro.nombre);

        vista.tarjeta.find('#detalle-autor').text(libro.autor.nombre ) ;
        vista.tarjeta.find('#detalle-fecha').text(libro.fecha_publicacion ) ;
        vista.tarjeta.find('#detalle-editorial').text(libro.editorial ) ;
        vista.tarjeta.find('#detalle-prologo').text(libro.prologo ) ;
    },

    agregarLibroCarrito:function(){
        var btn = $(this);
        var carrito = [] ;
        var libro   = [] ;
        var contador = 0 ;
        var libro  =  vista.modelo.libros;
        var idLibro = vista.modelo.libros._id ;
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


    },
};

vista = libroVista;
vista.init();