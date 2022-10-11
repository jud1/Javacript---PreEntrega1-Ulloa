/* CONVERSOR DE DIVISA */

/* DOM Elements */
const inputValor = document.getElementById('inputValor')
const inputDivisaEntrada = document.getElementById('inputDivisaEntrada')
const inputDivisaSalida = document.getElementById('inputDivisaSalida')
const botonTransformar = document.getElementById('botonTransformar')
const resultadoImpreso = document.getElementById('resultadoImpreso')

// [WIP: array de resultados por localstorage]
const historialResultado = [];
const olHistorialResultado = document.getElementById('listaHistorialResultado')

// class para los objetos divisa
class Divisa {
   constructor(nombre, abreviatura, valorReferencia){
      this.nombre = nombre
      this.abreviatura = abreviatura
      this.valorReferencia = valorReferencia
   }
}

// Array de objetos para aplicar metodos (basado en la clase anterior)
const divisas = [
   new Divisa('Peso Chileno', 'clp', 938),
   new Divisa('Dolar', 'us', 1),
   new Divisa('Yen Japones', 'jpy', 145)
]

// funcion que calcula el resultado
const resultado = function(valor, entrada, salida){
   let resultado = valor*salida.valorReferencia/entrada.valorReferencia
   return `${valor} ${entrada.abreviatura} = ${resultado} ${salida.abreviatura}`
}

// funcion para buscar la divisa mediante un find en el array de objetos
const buscarObjDivisa = function(abbreviatura){
   return divisas.filter( (el) => el.abreviatura.includes(abbreviatura) )
}

// Event listener para escuchar el boton y al click dar el resultado
botonTransformar.addEventListener('click', function(evt){
   //Prevenimos el redireccionamiento del anchor
   evt.preventDefault()
   
   // Si el input esta vacio (input type number)
   if (inputValor.value === ""){
      alert('Numero invalido, Por favor ingresa un NUMERO')
   }
   
   // Si el valor es menor o igual a 0, damos error
   else if (inputValor.value <= 0) {
      alert('Ingresa un numero MAYOR a 0')
   }

   // Ejecutamos si paso todos los errores
   else {
      //Obtenemos mediante find el objecto que selecciono en el select
      let objDivisa1 = buscarObjDivisa(inputDivisaEntrada.value)[0]
      let objDivisa2 = buscarObjDivisa(inputDivisaSalida.value)[0]

      // Invocamos a la funcion de calculo e creacion del string de resultado
      let resultadoFinal = resultado(Number(inputValor.value), objDivisa1, objDivisa2)
      
      // Imprimir el resultado en pantalla
      resultadoImpreso.textContent = resultadoFinal

      // Guardar el resultado en un array para proximamente guardarlo en un localstorage
      historialResultado.push(resultadoFinal)

      // Limpiamos lo que haya dentro del historial (inner del ul)
      olHistorialResultado.innerHTML = ''
      
      // forEach por cada resultado en el array imprimiendolo como li dentro del ul
      historialResultado.forEach( (historia)=> {
         // creamos el elemento y lo almacenamos en una varable
         let liElemento = document.createElement('li')
         
         //le imprimimos el resultado dentro del li como texto html
         liElemento.textContent = historia
         
         // Lo imprimimos con prepend para que siempre quede antes del siguiente y muestre siempre los ultimos primeros
         olHistorialResultado.prepend(liElemento)
      })     

   } 
})