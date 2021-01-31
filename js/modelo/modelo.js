/*
 * Modelo
 */
var Modelo = function() {
  this.estado = this.cargar();
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.respuestaAgregada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votoAgregado = new Evento(this);
  this.preguntaEditModificada = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    let ultimoId = 0;
    const preguntas = this.estado.preguntas
    for(i=0; i<preguntas.length; i++){
      if(preguntas[i].id>ultimoId){
        ultimoId=preguntas[i].id;
      }
    }
    return ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.estado.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();

  },

  eliminarPregunta: function(id) {
    const newArr = this.estado.preguntas.filter(function(pregunta){
      return pregunta.id !==  id
    })
    this.estado.preguntas = newArr;
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  getPreguntaById: function(id){
    const pregunta = this.estado.preguntas.filter(function(pregunta){
      return pregunta.id === id
    })
    return pregunta[0]
  },

  agregarRespuesta: function(id,respuesta){
    const pregunta = this.getPreguntaById(id);
    pregunta.cantidadPorRespuesta.push(respuesta); // TODO: Notificar Evento
    this.guardar();
    this.respuestaAgregada.notificar();
  },

  editarPregunta: function(id, nuevaPregunta, nuevasRespuestas){
    const pregunta = this.getPreguntaById(id);
    pregunta.textoPregunta = nuevaPregunta;
    pregunta.cantidadPorRespuesta = nuevasRespuestas;
    this.guardar();
    this.preguntaEditada.notificar();
  },

  agregarVoto: function(id, textoRespuesta){
    const pregunta = this.getPreguntaById(id);
    const respuestaAVotar = pregunta.cantidadPorRespuesta.filter(function(respuesta){
      return respuesta.textoRespuesta === textoRespuesta
    })[0]
    respuestaAVotar.votos+=1
    this.votoAgregado.notificar();
    this.guardar();
  },

  eliminarTodasLasPreguntas : function(){
    this.estado.preguntas = []
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  getPreguntas: function(){
    return this.estado.preguntas
  },

  getPreguntaEdit: function(){
    const preguntaEdit = this.estado.preguntaEdit;
    return {...preguntaEdit}
  },

  setPreguntaEdit: function(pregunta){
    this.estado.preguntaEdit = {...pregunta};
    this.guardar();
    this.preguntaEditModificada.notificar();
  },

  cargar: function() {
    const estado = localStorage.getItem('estado')
    if(!estado){
      return {
        preguntas: [],
        preguntaEdit: {}
      }
    }else{
      return JSON.parse(estado)
    }

  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem('estado' , JSON.stringify(this.estado))
  },
};
