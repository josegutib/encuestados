/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEditada.suscribir(function(){
    contexto.reconstruirLista();
  })

  this.modelo.preguntaEditModificada.suscribir(function(){
    contexto.popularModal()
  })
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem = $('<li>',{
        class: 'list-group-item',
        id: pregunta.id,
        text:pregunta.textoPregunta
    })
    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.controlador.getPreguntas();
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  mostrarModal: function(){
    const modal = $('#editarPreguntaModal');
    modal.css('display','block')
  },

  ocultarModal: function(){
    const modal = $('#editarPreguntaModal');
    modal.css('display','none')
  },

  popularModal: function(){
    var contexto = this;
    const preguntaEdit = this.controlador.getPreguntaEdit();
    $('#preguntaEdit').val(preguntaEdit.textoPregunta);
    const respuestasDom = document.getElementById("respuestasEdit");

    const input = (tag, texto)  => `<input id="respuesta-${tag}" type="text" value="${texto}"></input>`
    const button = (tag) => `<button id="btn-${tag}">eliminar</button>`

    const respuesta = (tag, text) => input(tag, text) + button(tag)

    respuestasDom.innerHTML = preguntaEdit.cantidadPorRespuesta
      .map( respuesta => respuesta.textoRespuesta)
      .map( (textoRespuesta, i) => respuesta(i, textoRespuesta))
      .join('\n')

      $('#respuestasEdit button').off("click")
      $('#respuestasEdit button').click(function(){
        const id = $(this).attr('id')
        const target = parseInt(id.split('-')[1])
        const preguntaEdit = contexto.controlador.getPreguntaEdit();
        preguntaEdit.cantidadPorRespuesta = preguntaEdit.cantidadPorRespuesta.filter( (elementoRespuesta, indice) => indice !== target );
        contexto.controlador.setPreguntaEdit(preguntaEdit);
      })

      $('#agregarRespuestaEdit').off("click")
      $('#agregarRespuestaEdit').click(function(){
        const preguntaEdit = contexto.controlador.getPreguntaEdit();
        preguntaEdit.cantidadPorRespuesta.push({
          textoRespuesta:'',
          votos:0
        })
        contexto.controlador.setPreguntaEdit(preguntaEdit);
      })

      $('#actualizarPreguntaEdit').off("click")
      $('#actualizarPreguntaEdit').click(function(){
        const preguntaEdit = contexto.controlador.getPreguntaEdit();
        const preguntaId = preguntaEdit.id
        const nuevaPregunta = $('#preguntaEdit').val()
        const nuevasRespuestas = $('#respuestasEdit input').toArray()
          .map(x => x.value)
          .map(textoRespuesta => ({textoRespuesta: textoRespuesta, votos: 0}))

        contexto.controlador.editarPregunta(preguntaId, nuevaPregunta, nuevasRespuestas)
        contexto.ocultarModal()
      })

  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        const textoRespuesta = $(this).val();
        if(textoRespuesta !== ""){
        respuestas.push({
          textoRespuesta: textoRespuesta,
          votos:0
        })
      }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    //asociar el resto de los botones a eventos

    e.botonBorrarPregunta.click(function() {
      const id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.eliminarPregunta(id);
    });

    e.borrarTodo.click(function(){
      contexto.controlador.eliminarTodasLasPreguntas()
    });

    e.botonEditarPregunta.click(function(){
      const idString = $('.list-group-item.active').attr('id')
      if (idString !== undefined){
        const pregunta = contexto.controlador.getPreguntaById(parseInt(idString));
        console.log(pregunta);
        contexto.controlador.setPreguntaEdit(pregunta);
        contexto.mostrarModal();
      }
    });

    e.cerralModal.click(function(){
      contexto.ocultarModal()
    })
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
