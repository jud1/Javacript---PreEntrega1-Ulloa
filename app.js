/* CONVERSOR DE DIVISA */

/*  */
/* https://stackoverflow.com/questions/7955965/how-come-json-cant-save-objects-functions */

/* -----------------------------
------ Definimos las class ------
----------------------------- */

// Definimos las Class: divisa
class Divisa {
   constructor(nombre, abreviatura, valorReferencia, local){
      this.nombre = nombre
      this.abreviatura = abreviatura
      this.valorReferencia = valorReferencia
      this.local = local
   }
}
// Class para operaciones
class Operaciones {
   constructor(monto, entrada, salida, fecha){
      this.monto = monto
      this.entrada = entrada
      this.salida = salida
      this.fecha = fecha
   }
   // [M] Calcula el resultado
   resultado = () => this.monto*(this.salida.valorReferencia)/(this.entrada.valorReferencia)

   // [M] Para dar el formato deseado de la moneda
   formatoLocale = (valor, moneda) =>  valor.toLocaleString(moneda.local, {style: 'decimal', currency: moneda.abreviatura})
   
   // [M] Crea un string para mostrar
   resultadoString = () => `
      ${this.formatoLocale(this.monto, this.entrada)} ${this.entrada.abreviatura.toLowerCase()} 
         = 
      ${this.formatoLocale(this.resultado(), this.salida)} ${this.salida.abreviatura.toLowerCase()} 
   `
   
}

// Definimos el numero maximo de resulados que pueda guardar el historial, por qué? porque puedo.
const maxHistorial = 20

// Desgraciadamente localstorage no guarda nuestros metodos, a continuacion tendremos que verificar si el objeto historial del local storage es nullish, si trae data lo traeremos y mediante una iteracion (map) armaremos un nuevo array con los objetos class con sus metodos dentro
const historialLocaleStorage = JSON.parse(localStorage.getItem('historial')) ?? []

const historial = historialLocaleStorage.length > 0 ? historialLocaleStorage.map(
   (item) => new Operaciones (
      item.monto,
      item.entrada,
      item.salida,
      item.fecha
   )
) : []


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

// Array de objetos para aplicar metodos (basado en la clase anterior)
const divisas = [
   new Divisa('Peso Chileno', 'CLP', 938, 'es-CL'),
   new Divisa('Dolar', 'USD', 1, 'en-US'),
   new Divisa('Yen Japones', 'JPY', 145, 'ja-JP')
]

// Funcion para buscar la divisa mediante un find en el array de objetos
const buscarObjDivisa = function(abreviatura){
   return divisas.filter( (el) => el.abreviatura.includes(abreviatura) )
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
document.getElementById('botonTransformar').addEventListener('click', evt => accion(evt) )

// Tambien escuchamos al enter 
window.addEventListener('keyup', evt => evt.key === 'Enter' && accion(evt) )