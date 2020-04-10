Menção honrosa a @paulcsmith por disponibilizar o repositório original que tornou este pacote possível.

## O que isto faz

* Salva uma String como Integer (remove não dígitos e multiplica por 100) para prevenir erros de arredondamento ao realizar cálculos (Ver Sacadas para detalhes)
* Remove símbolos da string (como símbolo da moeda $)
* Remove pontos (e.g. "1.000,50")
* Salva apenas os dois primeiros digitos da parte decimal ("R$500,559" é convertido para 50055 e não arredonda)
* Remove [a-zA-Z] das strings
* Aceita strings e números. Número serão armazenados tal como informado.
* Se um ponto flutuante for passado, ele será arredondado. (500,55 -> 501). Use apenas inteiros por segurança.

## Como usar

```JavaScript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Adicione o tipo BrazilianCurrency ao Mongoose
require('mongoose-currency-brazilian-real').loadType(mongoose);
const BrazilianCurrency = mongoose.Types.BrazilianCurrency;

// Se você não tiver declarado a constante BrazilianCurrency você poderá utilizar 'mongoose.Types.BrazilianCurrency'
const ProdutoSchema = Schema({
  preco: { type: BrazilianCurrency }
});

const Produto = mongoose.model('Produto', ProdutoSchema);

const produto = new Produto({ preco: "R$ 1.200,55" });
produto.preco; // Número: 120055
produto.preco = 1200;
produto.preco; // Número 1200 não irá arredondar ou multiplicar. Armazenada tal como é e deve representar R$ 12,00
```

### Schema options

Aceita o [esquema de opções de números](http://mongoosejs.com/docs/api.html#schema-number-js) do mongoose.

```JavaScript
// Irá validar se o mínimo é R$ 200,00 e o máximo é R$ 500,00
var ProdutoSchema = Schema({
  preco: { type: BrazilianCurrency, required: true, min: -20000, max: 50000 }
});

// Veja Sacadas (abaixo) para detalhes
```

### Exibindo para usuários finais (telas, relatórios, etc.)

Para exibir os valores aos usuários finais, lembre-se de chamar `.toFixed(2)` (e na sequência você pode mascarar o resultado)

```JavaScript
produto.preco.toFixed(2); // Retorna 1200.55
```

## Testando

Na raiz do diretório do projeto, execute `npm test`

## Sacadas

O valor é retornado como um inteiro. Por que? Porque somar dois pontos flutuantes pode causar erros de arredondamento.
```
// Isso não é bom
1.03 + 1.19; // 2.2199999999999998
```

### Cálculos com valores usando mongoose-currency-brazilian-real

```JavaScript
const produto1 = Produto.findById('id');
const produto2 = Produto.findById('id2');
produto1.preco; // retorna 103 que representa R$ 1,03
produto2.preco; // retorna 119 que representa R$ 1,19
const soma = (produto1.preco + produto2.preco) / 100;
soma.toFixed(2); // retorna um número: 2.22
```

### Exibindo valores para usuários finais

```JavaScript
const registro = Produto.findById('seuid');
registro.preco; // 10050 que representa R$ 100,50
registro.preco.toFixed(2); // retorna 100.50
```

Quando você atribui um inteiro, ele NÃO será multiplicado por 100. Será armazenado tal como é!
Isto é de propósito, pois esta biblioteca foi criada principalmente para aceitar entradas realizadas por USUÁRIOS.
```
produto.preco = 100;
produto.preco; // Retorna 100 e não multiplica por 100. Representa R$ 1,00
```

### Consultas e validadores

Lembre-se que ao fazer consultas para encontrar valores maiores que, menores que, etc. você precisará multiplicar por 100!

Então para retornar valores maiores que R$ 100,00 você precisará realizar a consulta com 100 * 100 e.g. 10000

*Esta é considerada uma boa prática para armazenar valores monetários como inteiros.
Causará muito menos problemas pelo caminhho*

Para uma leitura mais aprofundada: http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html

Apenas lembre-se de chamar `toFixed(2)` toda vez que você quiser exibir os valores para o usuário.
