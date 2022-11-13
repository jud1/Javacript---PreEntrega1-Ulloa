// Definimos las Class: divisa
export class Divisa {
   constructor(nombre, abreviatura, valorReferencia, local){
      this.nombre = nombre
      this.abreviatura = abreviatura
      this.valorReferencia = valorReferencia
      this.local = local
   }
}

// Class para operaciones
export class Operaciones {
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