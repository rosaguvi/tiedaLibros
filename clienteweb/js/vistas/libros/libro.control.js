var libroControl = {

    consultarPorId:function(libro, success){
        __app.ajax({
            ruta:__app.rutas.API.LIBROS.CONSULTAR_POR_ID,
            success:success,
            data:{id:libro}
        });
    },
    consultarTodos:function(success){
        __app.ajax({
            ruta:__app.rutas.API.LIBROS.CONSULTAR_TODOS,
            success:success
        });
    },
};
