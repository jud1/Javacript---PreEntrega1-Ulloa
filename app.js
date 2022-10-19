/* CONVERSOR DE DIVISA */

/* DOM Elements */
const inputValor = document.getElementById('inputValor')
const inputDivisaEntrada = document.getElementById('inputDivisaEntrada')
const inputDivisaSalida = document.getElementById('inputDivisaSalida')
const botonTransformar = document.getElementById('botonTransformar')
const resultadoImpreso = document.getElementById('resultadoImpreso')

// Definimos las variables para la lista guardada en local storage
const historialResultado = JSON.parse(localStorage.getItem('historial')) ?? []
const olHistorialResultado = document.getElementById('listaHistorialResultado')
const maxHistorial = 20

// [Imprimir en el DOM] Funcion para poder detonarla al iniciar la app si es que hay resultados de sesiones anteriores
const imprimirHistorial = lista => {
   // Vaciamos el ul
   olHistorialResultado.innerHTML = ''

   lista.forEach( item => {

      // creamos el elemento y lo almacenamos en una variable
      let liElemento = document.createElement('li')
      
      // Le imprimimos el resultado dentro del li como texto html
      liElemento.textContent = `${item.resultado} --- ${new Date(item.fecha).toLocaleString()}`
      
      // Lo imprimimos con prepend para que siempre quede antes del siguiente y muestre siempre los ultimos primeros
      olHistorialResultado.prepend(liElemento)
   }); 
}

// Ejecutamos la fn anterior solo si el array es mayor a 0 (al iniciar la app)
historialResultado.length > 0 && imprimirHistorial(historialResultado)

// Class para los objetos divisa
class Divisa {
   constructor(nombre, abreviatura, valorReferencia, stringLocal, stringLocalExt){
      this.nombre = nombre
      this.abreviatura = abreviatura
      this.valorReferencia = valorReferencia
      this.stringLocal = stringLocal
      this.stringLocalExt = stringLocalExt
   }
}

// Array de objetos para aplicar metodos (basado en la clase anterior)
const divisas = [
   new Divisa('Peso Chileno', 'clp', 938, 'es-CL', {style:"currency", currency:"CLP"}),
   new Divisa('Dolar', 'us', 1, 'en-US', {style:"currency", currency:"USD"}),
   new Divisa('Yen Japones', 'jpy', 145, 'ja-JP', {style:"currency", currency:"JPY"})
]

// Funcion que calcula el resultado en string
const resultado = function(valor, entrada, salida){
   let resultado = valor*salida.valorReferencia/entrada.valorReferencia
   return `
      ${valor.toLocaleString(entrada.stringLocal, entrada.stringLocalExt)} 
      ${entrada.abreviatura} 
      = 
      ${resultado.toLocaleString(salida.stringLocal, salida.stringLocalExt)} 
      ${salida.abreviatura}
   `
}

// Funcion para buscar la divisa mediante un find en el array de objetos
const buscarObjDivisa = function(abbreviatura){
   return divisas.filter( (el) => el.abreviatura.includes(abbreviatura) )
}

// Funcion de ejecucion del progra,a
const accion = evt => {
   // Prevenimos el redireccionamiento del anchor
   evt.preventDefault()
   
   // Obtenemos mediante find el objecto que selecciono en el select
   let objDivisa1 = buscarObjDivisa(inputDivisaEntrada.value)[0]
   let objDivisa2 = buscarObjDivisa(inputDivisaSalida.value)[0]
   
   // Si el input es erroneo
   if (inputValor.value === "" || inputValor.value <= 0){
      UIkit.notification('Numero invalido, Por favor ingresa un numero mayor a 0', { status:'danger' })
   }

   // Si las divisas son las mismas
   else if (objDivisa1 === objDivisa2) {
      UIkit.notification('Las divisas son las mismas', { status:'danger' })
   }
   
   // Ejecutamos si paso todos los errores
   else {
      // Invocamos a la funcion de calculo y creacion del string de resultado
      let resultadoFinal = resultado(Number(inputValor.value), objDivisa1, objDivisa2)
      
      // Imprimir el resultado en pantalla
      resultadoImpreso.textContent = resultadoFinal
   
      /* Comenzamos con el historial */

      // Si hay mas de la cantidad permitida de resultados, eliminar el mas viejo
      historialResultado.length >= maxHistorial &&  historialResultado.shift()
   
      // luego pusheamos un objeto en el array
      historialResultado.push({resultado: resultadoFinal, fecha: Date.now()}) //.toLocaleString()
      
      // Reescribimos el localStorage
      localStorage.setItem('historial', JSON.stringify(historialResultado))
   
      // reimprimimos los resultados si es que hay
      historialResultado.length > 0 && imprimirHistorial(historialResultado)
   
   } 

}

// Event listener para escuchar el boton y al click dar el resultado
botonTransformar.addEventListener('click', function(evt){
   accion(evt)
})

// Tambien escuchamos al enter 
window.addEventListener('keyup', function(evt){
   if (evt.key === 'Enter' || evt.keyCode === 13) {
      accion(evt)
   }
})