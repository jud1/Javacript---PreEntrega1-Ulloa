/* CONVERSOR DE DIVISA */

// Inicializamos una variable para la seleccion que escoja el usuario
let selection = null;
let valorTranformar = null;

// Creamos una funcion para reutilizar en caso de error, donde retornamos el valor de la opcion escogida
function setSelection(){
   
   return selection = Math.trunc(prompt(`Ingresa la conversión que deseas: \n 1.- Peso Chileno a Dolar \n 2.- Peso Chileno a Euro \n 3.- Dolar a Peso Chileno \n 4.- Dolar a Euro \n 5.- Euro a Peso Chileno \n 6.- Euro a Dolar`))

}

// Creamos un blucle que sin no cumple con los requisitos se seguira ejecutando indefinidamente
while( selection<=0 || selection>=7 || isNaN(selection) ) {
   
   // Llamamos la funcion para que el usuario escoja
   setSelection()
   
   // Comprobacion dev
   // console.log(selection, typeof selection);
   
   // Comprobamos si la opcion escogida es valida, si es asi ejecutamos un break antes del mensaje de error
   if(selection<=6 && selection>=1 && !isNaN(selection)){
      break
   }
   // Antes del loop, mostramos un mensaje de error al usuario
   alert('Ocurrió un problema, intentalo nuevamente')

}

// Bucle similar al anterior, con la diferencia con que solo verifica si es numero y mayor que 0
while(isNaN(valorTranformar) || valorTranformar<=0){
   valorTranformar = prompt("Escoja el monto a tranformar:");
   if(!isNaN(valorTranformar) && valorTranformar>0){
      break
   }
   alert('Error: escoja un NUMERO mayor a 0')
}

// Funcion para mostrar el resultado mediante un alert
function resultado(divisa1, divisa2, multipicador){
   return alert(`$${valorTranformar} ${divisa1} = $${valorTranformar*multipicador} ${divisa2}`)
}

// Switch para iterar los casos dependiendo de la tranformacion de la conversion
switch(selection) {
   case 1:
      resultado("clp", "usd", 0.0010)
      break
   case 2:
      resultado("clp", "eur", 0.0011)
         break
   case 3:
      resultado("usd", "clp", 989.4500)
      break
   case 4:
      resultado("usd", "eur", 1.0403)
      break
   case 5:
      resultado("eur", "clp", 951.1286)
      break
   case 6:
      resultado("eur", "usd", 0.9613)
      break
   default:
      alert('Error')
      break
}