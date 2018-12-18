/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = this.cargar();
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.respuestaAgregada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votoSumado = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    let ultimoId = 0;
    let self = this;
    for(i=0; i<self.preguntas.length; i++){
      if(self.preguntas[i].id>ultimoId){
        ultimoId=self.preguntas[i].id;
      }
    }
    return ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas, 'votos':0};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();

  },

  eliminarPregunta: function(id) {
    const newArr = this.preguntas.filter(function(pregunta){
      return pregunta.id !==  id
    })
    this.preguntas = newArr;
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  getPreguntaById: function(id){
    const pregunta = this.preguntas.filter(function(pregunta){
      return pregunta.id === id
    })
    return pregunta[0]
  },

  agregarRespuesta: function(id,respuesta){
    const pregunta = getPreguntaById(id);
    pregunta.cantidadPorRespuesta.push(respuesta); // TODO: Notificar Evento
    this.guardar();
    this.respuestaAgregada.notificar();
  },

  editarPregunta: function(id, nuevaPregunta, nuevasRespuestas){
    const pregunta = getPreguntaById(id);
    pregunta.textoPregunta = nuevaPregunta;
    pregunta.cantidadPorRespuesta = nuevasRespuestas;
    this.guardar();
    this.preguntaEditada.notificar();
  },

  sumarUnVoto: function(id){
    const pregunta = getPreguntaById(id);
    pregunta.votos+=1
    this.votoSumado.notificar();
    this.guardar();
  },

  eliminarTodasLasPreguntas : function(){
    this.preguntas = []
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  cargar: function() {
    const preguntas = localStorage.getItem('preguntas')
    if(!preguntas){
      return []
    }else{
      return JSON.parse(preguntas)
    }

  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem('preguntas' , JSON.stringify(this.preguntas))
  },
};
