/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
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
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
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



  //se guardan las preguntas
  guardar: function(){
  },
};
