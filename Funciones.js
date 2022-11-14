import { Operaciones } from "./Clases.js"; 

// [Imprimir en el DOM] Funcion para poder detonarla al iniciar la app si es que hay resultados de sesiones anteriores
const imprimirHistorial = lista => {
   // DOM Resultados ID
   const tablaHistorial = document.getElementById('tablaHistorial');
   
   // Vaciamos el ul
   tablaHistorial.innerHTML = ''

   // For each en todos los resulados
   for(const item of lista) {
      // Desestructuración  
      const {monto, entrada, salida, fecha, resultado, formatoLocale} = item

      // ------------------------- [PRINT] -------------------------
      // <tr> padre
      const tr = document.createElement('tr')
      
      // <td> hijo entrada
      const tdEntrada = (document.createElement('td'))
      tdEntrada.textContent = `${formatoLocale(monto, entrada)} ${entrada.abreviatura.toLowerCase()}`
      // <td> hijo entrada
      const tdFlecha = (document.createElement('td'))
      tdFlecha.innerHTML = '&rarr;' 
      // <td> hijo salida
      const tdSalida = (document.createElement('td'))
      tdSalida.textContent = `${formatoLocale(resultado(), salida)} ${salida.abreviatura.toLowerCase()}`
      // <td> hijo conversion
      const tdconversion = (document.createElement('td'))
      tdconversion.textContent =  `*${(salida.valorReferencia/entrada.valorReferencia).toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 4})}`
      // <td> hijo fecha
      const tdFechainv = (document.createElement('td'))
      tdFechainv.textContent = new Date(fecha).toLocaleString() 
      
      //Añadimos todos los td al tr padre
      tr.append(tdEntrada, tdFlecha, tdSalida, tdconversion, tdFechainv)
      
      // Lo imprimimos con prepend para que siempre quede antes del siguiente y muestre siempre los ultimos primeros
      tablaHistorial.prepend(tr)
   }

}

// Funcion para buscar la divisa mediante un find en el array de objetos
const buscarObjDivisa = function(lista, abreviatura){
   return lista.filter( (el) => el.abreviatura.includes(abreviatura) )
}

// Funcion de ejecucion del programa
const conversorPrincipal = (evt, divisas, historial) => {

   // Creamos el objeto desde la class que tiene todos los datos de la conversion
   const operacion =  new Operaciones (
      // Monto de la accion (via nodo input)
      Number(document.getElementById('inputMonto').value),
      // Encontrados mediante la funcion buscarObjDivisa
      buscarObjDivisa(divisas, document.getElementById('inputDivisaEntrada').value)[0], 
      buscarObjDivisa(divisas, document.getElementById('inputDivisaSalida').value)[0], 
      // Date de la accion
      Date.now() 
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
      
      // Definimos el numero maximo de resulados que pueda guardar el historial, por qué? porque puedo.
      const maxHistorial = 20

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

export { imprimirHistorial, buscarObjDivisa, conversorPrincipal }