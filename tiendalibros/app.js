var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var db = null;



var app = express();
app.use(bodyParser.urlencoded({encoded:true, extended:true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


app.post('/libros/registrar', registrarLibro);
app.post('/autores/registrar', registrarAutor);

app.get('/paises/consultar', consultarPaises);

app.get('/libros/consultar', consultarLibros);
app.get('/autores/consultar', consultarAutores);

app.get('/libro/:id', consultarLibroId);

app.get('/libros/autor/:autor', consultarLibrosPorAutor);
app.get('/libros/buscar/:q', consultarLibrosPorNombre);
app.get('/autor/:id', consultarAutorPorId);


function registrarLibro(req, res){
    var libros = db.collection('libros');
    var nuevoLibro = {
        nombre: req.body.nombre,
        autor: new ObjectId(req.body.autor),
        precio: parseFloat(req.body.precio),
        portada: req.body.portada ,
        fecha_publicacion: req.body.fecha_publicacion ,
        editorial: req.body.editorial ,
        prologo: req.body.prologo
    };
    libros.insertOne(nuevoLibro, function(err, resultado){
        if (err) { return validarError(res, err, 'Ocurrió un error al registrar el libro') }
        res.send({mensaje:'Libro registrado exitosamente', codigo: 2 });
    });
};

function registrarPais(req, res){
    var pais = db.collection('paises');
    var nuevoPais = {
        nombre: req.body.nombre,
        nacionalidad: new ObjectId(req.body.nacionalidad)
    };

    pais.insertOne(nuevoPais, function(err, resultado){
        if (err) { return validarError(res, err, 'Ocurrió un error al registrar el pais') }
        res.send({mensaje:'Pais registrado exitosamente', codigo: 2 });
    });
};

function registrarAutor(req, res){
    var autores = db.collection('autores');
    var nuevoAutor = {
        nombre: req.body.nombre ,
        fecha_nacimiento: req.body.fecha_nacimiento ,
        nacionalidad: new ObjectId(req.body.nacionalidad),
        foto: req.body.foto,
        biografia: req.body.biografia
    };
    autores.insertOne(nuevoAutor, function(err, resultado){
        if (err) { return validarError(res, err, 'Ocurrió un error al registrar el autor') }
        res.send({mensaje:'Autor registrado exitosamente', codigo: 2});
    });
};

/****   Consultas ****/

function consultarLibros(req, res){
    var libros = db.collection('libros');
    libros.aggregate(
        [
            {
                '$lookup': {
                    from: "autores",
                    localField: "autor",
                    foreignField: "_id",
                    as: "autor"
                },
            },
            { "$unwind": "$autor" },
            { $sort:{'precio': -1, 'nombre': 1} }
        ],
        function(err, cursor) {
            cursor.toArray(function(err, documents) {
                if (err) { return validarError(res, err, 'Ocurrió un error al consultar los libros') }
                res.send(construirRespuestaDatos(documents, 'Libros encontrados'));
            });
        }
    );
}


function consultarAutores(req, res){
    var autores = db.collection('autores');
    autores.aggregate(
        [
            {
                $lookup:{
                    from:'paises',
                    localField:'nacionalidad',
                    foreignField:'_id',
                    as:'nacionalidad'
                }
            },
            { "$unwind": "$nacionalidad" },
            {  $sort:{ 'nombre': 1} },
        ],
        function(err, cursor) {
            cursor.toArray(function(err, documents) {
                if (err) { return validarError(res, err, 'Ocurrió un error al consultar los Autores') }
                res.send({mensaje:'Autores encontrado', codigo:1, data:documents});
            });
        }
    );
}


function consultarLibroId(req, res){
    var id = new ObjectId(req.params.id);
    var libros = db.collection('libros');
    libros.aggregate(
        [
            {
                $lookup:{
                    from:'autores',
                    localField:'autor',
                    foreignField:'_id',
                    as:'autor'
                }
            },
            { "$unwind": "$autor" },
            {   $match: { _id : new ObjectId(id) } }
        ],
        function(err, cursor) {
            cursor.toArray(function(err, documents) {
                if (err) { return validarError(res, err, 'Ocurrió un error al consultar los libros') }
                res.send({mensaje:'Libro encontrado', codigo:1, data:documents[0]});
            });
        }
    );
}

function consultarAutorPorId(req, res){
    var id = new ObjectId(req.params.id);
    var autor = db.collection('autores');
    autor.aggregate(
        [
            {
                $lookup:{
                    from:'paises',
                    localField:'nacionalidad',
                    foreignField:'_id',
                    as:'nacionalidad'
                }
            },
            { "$unwind": "$nacionalidad" },
            { $match: { _id :id } }
        ],
        function(err, cursor) {
            cursor.toArray(function(err, documents) {
                if (err) { return validarError(res, err, 'Ocurrió un error al consultar el Autor') }
                res.send({mensaje:'Autor encontrado', codigo:1, data:documents[0]});
            });
        }
    );
}

function consultarLibrosPorAutor(req, res){
    var autores = db.collection('libros');
    var idAutor = req.params.autor;
    console.log(idAutor);
    autores.find({autor:new ObjectId(idAutor)}).toArray(function(err, data){
        if (err) { return validarError(res, err, 'Error al consultar libros por autor') }
        res.send(construirRespuestaDatos(data, 'Libros encontrados por autor'));
    });
}

function consultarLibrosPorNombre(req, res){
    var q = req.params.q;
    console.log(q);
    var regExpr = new RegExp(q, 'i');
    var libros = db.collection('libros');
    libros.aggregate(
        [
            {
                $lookup:{
                    from:'autores',
                    localField:'autor',
                    foreignField:'_id',
                    as:'autor'
                }
            },
            { "$unwind": "$autor" },
            {   $sort:{'precio': -1, 'nombre': 1} },
            {   $match: { nombre : { $regex: regExpr, $options:'i' } } }
        ],
        function(err, cursor) {
            cursor.toArray(function(err, documents) {
                if (err) { return validarError(res, err, 'Ocurrió un error al consultar los libros') }
                res.send(construirRespuestaDatos(documents, 'Libros encontrados'));
            });
        }
    );
}

/****  Termina Consultas ****/



/**** mias *****/

function consultarPaises(req, res){
    var paises = db.collection('paises');
    var opciones = {
        collation:{locale:'es'},
        sort:{ 'nombre': 1}
    };
    paises.find({}, opciones).toArray(function(err, data){
        if (err) { return validarError(res, err, 'Ocurrió un error al consultar los paises') }
        res.send(construirRespuestaDatos(data, 'Paises Econtrados'));
    });
}


/**** Termina mias *****/

function validarError(res, err, mensaje) {
    console.error(err);
    res.send({mensaje:mensaje, codigo:-1 });
    return false;
}

function construirRespuestaDatos(data, mensaje) {
    var respuesta = {};
    if (data && data.length > 0 ){
        respuesta.codigo = 1;
        respuesta.mensaje = mensaje;
        respuesta.data = data;
        return respuesta;
    }

    return {
        codigo:0,
        mensaje:'No se encontraron resultados'
    }
}

MongoClient.connect('mongodb://rsagudelo:8327rosmira@ds239648.mlab.com:39648/tiendalibros', function(err, client){
    if (err) { return console.log(err); }
    db = client.db('tiendalibros');
    app.listen(5000);
    console.log('Servidor corriendo en puerto 5000');
});
