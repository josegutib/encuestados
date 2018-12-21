/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },

  eliminarPregunta: function(id){
    this.modelo.eliminarPregunta(id)
  },

  eliminarTodasLasPreguntas: function(){
    this.modelo.eliminarTodasLasPreguntas()
  },

  agregarVoto: function(id, textoRespuesta){
    this.modelo.agregarVoto(id, textoRespuesta)
  },

  getPreguntaById: function(id){
    return this.modelo.getPreguntaById(id)
  },

  getPreguntas: function(){
    return this.modelo.getPreguntas()
  },

  getPreguntaEdit: function(){
    return this.modelo.getPreguntaEdit()
  },

  setPreguntaEdit: function(pregunta){
    this.modelo.setPreguntaEdit(pregunta)
  },

  editarPregunta: function(id, nuevaPregunta, nuevasRespuestas) {
    this.modelo.editarPregunta(id, nuevaPregunta, nuevasRespuestas)
  }
};
