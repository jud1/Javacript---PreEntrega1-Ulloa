/* CONVERSOR DE DIVISA */

/* new Date(fecha).toLocaleString() */

// Definimos el numero maximo de resulados que pueda guardar el historial, por qué? porque puedo.
const maxHistorial = 20

// Consultamos si existe data dentro de nuestro local storage
const historial = JSON.parse(localStorage.getItem('historial')) ?? []

// [Imprimir en el DOM] Funcion para poder detonarla al iniciar la app si es que hay resultados de sesiones anteriores
const imprimirHistorial = lista => {
   // DOM Resultados ID
   const tablaHistorial = document.getElementById('tablaHistorial');
   
   // Vaciamos el ul
   tablaHistorial.innerHTML = ''

   // For each en todos los resulados
   for(const item of lista) {
      console.log(item)
      // ------------------------- [PRINT] -------------------------
      // <tr> padre
      const tr = document.createElement('tr')
      
      // <td> hijo entrada
      const tdEntrada = (document.createElement('td'))
      tdEntrada.textContent = `a` 
      // <td> hijo entrada
      const tdFlecha = (document.createElement('td'))
      tdFlecha.innerHTML = '&rarr;' 
      // <td> hijo salida
      const tdSalida = (document.createElement('td'))
      tdSalida.textContent = `c` 
      // <td> hijo conversion
      const tdconversion = (document.createElement('td'))
      tdconversion.textContent = `d` 
      // <td> hijo fecha
      const tdFechainv = (document.createElement('td'))
      tdFechainv.textContent = `e` 
      // <td> hijo accion
      const tdAccion = (document.createElement('td'))
      tdAccion.textContent = `f` 
      
      //Añadimos todos los td al tr padre
      tr.append(tdEntrada, tdFlecha, tdSalida, tdconversion, tdFechainv, tdAccion)
      
      // Lo imprimimos con prepend para que siempre quede antes del siguiente y muestre siempre los ultimos primeros
      tablaHistorial.prepend(tr)
   }
/*    lista.forEach( item  => {
   }) */

}
// Ejecutamos la fn anterior solo si el array es mayor a 0 (al iniciar la app)
historial.length > 0 && imprimirHistorial(historial)

// Class para los objetos divisa
class Divisa {
   constructor(nombre, abreviatura, valorReferencia, local){
      this.nombre = nombre
      this.abreviatura = abreviatura
      this.valorReferencia = valorReferencia
      this.local = local
   }
}
// Class para los objetos operaciones
class Operaciones {
   constructor(monto, entrada, salida, fecha){
      this.monto = monto
      this.entrada = entrada
      this.salida = salida
      this.fecha = fecha
   }

   // Calcula el resultado
   resultado = () => this.monto*(this.salida.valorReferencia)/(this.entrada.valorReferencia)

   // Para dar el formato deseado de la moneda
   formatoLocale = (valor, moneda) =>  valor.toLocaleString(moneda.local, {style: 'currency', currency: moneda.abreviatura})
   
   // Crea un string para mostrar
   resultadoString = () => `
      ${this.formatoLocale(this.monto, this.entrada)} ${this.entrada.abreviatura.toLowerCase()} 
         = 
      ${this.formatoLocale(this.resultado(), this.salida)} ${this.salida.abreviatura.toLowerCase()} 
   `
}

// Array de objetos para aplicar metodos (basado en la clase anterior)
const divisas = [
   new Divisa('Peso Chileno', 'CLP', 938, 'es-CL'),
   new Divisa('Dolar', 'USD', 1, 'en-US'),
   new Divisa('Yen Japones', 'JPY', 145, 'ja-JP')
]

// Funcion para buscar la divisa mediante un find en el array de objetos
const buscarObjDivisa = function(abbreviatura){
   return divisas.filter( (el) => el.abreviatura.includes(abbreviatura) )
}

// Funcion de ejecucion del programa
const accion = evt => {
   // Prevenimos el redireccionamiento del anchor
   evt.preventDefault()

   // Dom elements a usar
   const inputMonto = document.getElementById('inputMonto')
   const inputEntrada = document.getElementById('inputDivisaEntrada')
   const inputSalida = document.getElementById('inputDivisaSalida')

   // Creamos el objeto desde la class que tiene todos los datos de la conversion
   const operacion =  new Operaciones (
      Number(inputMonto.value), // Monto de la accion
      buscarObjDivisa(inputEntrada.value)[0], // Encontrado mediante la funcion
      buscarObjDivisa(inputSalida.value)[0], // Encontrado mediante la funcion
      Date.now() // Date de la accion
   )
   
   // Si el input es erroneo
   if (operacion.monto === "" || operacion.monto <= 0){
      UIkit.notification('Numero invalido, Por favor ingresa un numero mayor a 0', { status:'danger' })
   }

   // Si las divisas son las mismas
   else if (operacion.entrada === operacion.salida) {
      UIkit.notification('Las divisas son las mismas', { status:'danger' })
   }
   
   // Ejecutamos si paso todos los errores
   else {
      
      // Imprimir el resultado en pantalla
      document.getElementById('resultadoImpreso').textContent = operacion.resultadoString()
   
      /*------------------------------- 
      Comenzamos con el historial 
      -------------------------------*/

      // Si hay mas de la cantidad permitida de resultados, eliminar el mas viejo
      historial.length >= maxHistorial &&  historial.shift()
   
      // luego pusheamos un objeto en el array
      historial.push(operacion) //.toLocaleString()
      
      // Reescribimos el localStorage
      localStorage.setItem('historial', JSON.stringify(historial))
   
      // reimprimimos los resultados si es que hay
      historial.length > 0 && imprimirHistorial(historial)
   } 

}

// Event listener para escuchar el boton y al click dar el resultado
document.getElementById('botonTransformar').addEventListener('click', function(evt){
   accion(evt)
})

// Tambien escuchamos al enter 
window.addEventListener('keyup', function(evt){
   if (evt.key === 'Enter' || evt.keyCode === 13) {
      accion(evt)
   }
})