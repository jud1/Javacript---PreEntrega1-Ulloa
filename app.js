/* CONVERSOR DE DIVISA */

// Uso de imports para ordenar un poco el tema
import { Divisa, Operaciones } from "./Clases.js";
import { imprimirHistorial, conversorPrincipal } from "./Funciones.js";

// Desgraciadamente localstorage no guarda nuestros metodos, a continuacion tendremos que verificar si el objeto historial del local storage es nullish, si trae data lo traeremos y mediante una iteracion (map) armaremos un nuevo array con los objetos class con sus metodos dentro

// Consultamos localStorage, true = almacenamos, false = asignamos array vacio
const almacenamientoLocal = JSON.parse(localStorage.getItem('historial')) ?? []

// Recorremos el posible resultado del localStorage, si trae elementos los convertimos en objetos de la clase Operaciones
const historial = almacenamientoLocal.length > 0 ? almacenamientoLocal.map(
   (item) => new Operaciones (
      item.monto,
      item.entrada,
      item.salida,
      item.fecha
   )
) : []

// Ejecutamos la fn anterior solo si el array es mayor a 0 (al iniciar la app)
historial.length > 0 && imprimirHistorial(historial)

// Event listener para escuchar el boton y al click dar el resultado
document.getElementById('botonTransformar').addEventListener('click', evt => {
   // Prevenimos el redireccionamiento del anchor
   evt.preventDefault()

   // Declaramos divisas, para poder traer una posible divisa del local storage con una antiguedad no mas lejana a 1 hora
   const divisas = JSON.parse(localStorage.getItem('divisas')) 
      ?? { timestamp: null, list: [] }

   // Comprobar si existe data en el local Storage o mas antigua que 1 hora, de lo contrario consumir api
   if( divisas.timestamp === null || moment().diff(moment.unix(divisas.timestamp), 'hours')>=1 ) { 
      

      // Setear opciones de la API
      const peticionHeaders = new Headers();
      peticionHeaders.append('apikey', 'nadSekPMfdohHmxT29rjJcLCM8BPvAZy');
      const opcionesPeticion = { method: 'GET', redirect: 'follow', headers: peticionHeaders }

      // Fetch de la API https://apilayer.com/marketplace/fixer-api#documentation-tab
      fetch('https://api.apilayer.com/fixer/latest?symbols=JPY%2C%20CLP&base=USD', opcionesPeticion)
         .then(respuesta => respuesta.json())
         
         // Usar respuesta
         .then(data => {

            // Actualizamos el Timestamp
            divisas.timestamp = Date.now()

            // Actualizamos los valores de las divisas
            divisas.list.push(new Divisa('Peso Chileno', 'CLP', data.rates.CLP, 'es-CL'))
            divisas.list.push(new Divisa('Yen Japones', 'JPY', data.rates.JPY, 'ja-JP'))
            divisas.list.push(new Divisa('Dolar', 'USD', 1, 'en-US'),)

            // Almacenamos en localStorage
            localStorage.setItem('divisas', JSON.stringify(divisas))

            // Ejecutar
            conversorPrincipal(evt, divisas.list, historial) 
         })
         .catch(error => console.log('error', error));

   }
   else {
      // Usar datos del local
      conversorPrincipal(evt, divisas.list, historial)
   }  
})