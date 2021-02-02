
class Despesa {
	constructor (ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
	/* this[i] é como this.ano só que passa por todos os atributos*/ 
		if(this[i] == undefined || this[i] == '' || this[i] == null) {
			return false

			}
		} 
		return true 
	} 
}

class Bd {

	constructor(){

		//Assim garante msm que ainda não tenha algum item id, de 0 como item ao invés de null

		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id',0)
		}
	}
//Confere se já tem um id e recupera antes de gravar o próximo
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {

//Aqui acessa o recurso de local storage e ele retorna um objeto de manipulação do local storage
//O seItem permite passar dois parametros: a identificação do objeto que vamos direcionar e o dado que queremos armazenar e que precisa ser encaminhado através de uma notação JSON
//Então recebemos um objeto literal na função e convertemos em JSON através do objeto nativo stringify

	//localStorage.setItem('despesa', JSON.stringify(d))

	// Assim temos o identificador do item ('despesa') que queremos incluir no local storage e o próprio item (d) com os dados em si
	//Após incluir o item, é necessário colocar um identificador único para cada entrada pois as próximas entradas irão sobrepor as anteriores
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	carregarTodosRegistros(){

		let despesas = Array()

		let id = localStorage.getItem('id')

		//recupera todas as despesas cadastradas em localstorage
		for(let i = 1; i <= id; i++) {

			//recupera a despesa e converte o objeto JSON em objeto literal sendo assim passível de ser trabalhada na aplicação
			let despesa = JSON.parse(localStorage.getItem(i))

			//Verifica para ver se tem indices pulados ou inválidos como null e literalmente pula tais indices

			if(despesa === null) {
				continue
			}
		
			//Aqui coloca cada uma da despesa dentro do array despesas usando o comando push

//coloca aqui o id em cada um do item
			despesa.id = i
			despesas.push(despesa)

		}

		return despesas

	}

	pesquisar(despesa) {

//Aqui recuperou todos os dados de localStorage e colocou em uma variável

		let despesasFiltradas = Array()

		despesasFiltradas = this.carregarTodosRegistros()

//Aqui pegou os dados do atributo da pesquisa, dai permite comparar os dois objetos
//Usa .filter no array com todos os dados. Dai usando a função de callback, verifica se o valor de x é igual a y. No caso, se o valor de cada item do indice do array tem certo valor. No caso se cada uma dos valores de ano por ex de despesasFiltradas é igual ao valor definido em ano de despesa
//Pra evitar avaliar valores vazios, usa o if para não aceitar ''

if(despesa.ano != '') {
despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
}

if(despesa.mes != '') {
despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
}

if(despesa.dia != '') {
despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
}

if(despesa.tipo != '') {
despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
}

if(despesa.descricao != '') {
despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
}

if(despesa.valor != '') {
despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
}

return despesasFiltradas

}

	remover(id) {
		localStorage.removeItem(id)
	}

}

let bd = new Bd()


function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')				

	let despesa = new Despesa (
			ano.value,
			mes.value,
			dia.value,
			tipo.value,
			descricao.value,
			valor.value
		)
		
if(despesa.validarDados()) {
		bd.gravar(despesa)
		
		document.getElementById('mRDdiv').className = "modal-header text-success"
		document.getElementById('exampleModalLabel').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('textend').innerHTML = 'Despesa foi cadastrada com sucesso'
		document.getElementById('bback').innerHTML = 'Voltar'
		document.getElementById('bback').className = "btn btn-success"

		$('#modalRegistroDespesa').modal('show')		

		ano.value = ''	
		mes.value = ''	
		dia.value = ''	
		tipo.value = ''	
		descricao.value = ''	
		valor.value = ''				


} else {
	//Aqui o bootstrap usa o jquerry, não explicou muito como funciona, mas basicamente seleciona o id do elemento que quer selecionar e atuat. Depois executa o método modal passando o parametro show.


		document.getElementById('mRDdiv').className = "modal-header text-danger"
		document.getElementById('exampleModalLabel').innerHTML = 'Erro na gravação'
		document.getElementById('textend').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
		document.getElementById('bback').innerHTML = 'Voltar e corrigir'
		document.getElementById('bback').className = "btn btn-danger"

		$('#modalRegistroDespesa').modal('show')

}

}

//Filtro false/true é para evitar que se não tiver nada que bata na pesquisa seja não seja retornado nada ao invés de retornar todos os itens do array

function carregaListaDespesas(despesas = Array() /*Recebe um array por default*/, filtro = false) {
	
	//Se o array é vazio ele carrega todos os registros. Se não é vazio ele 
	if(despesas.length == 0 && filtro == false) {
	despesas = 	bd.carregarTodosRegistros()
	}
	
	//selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById("listaDespesas")
	listaDespesas.innerHTML = ''

	//percorrer o array despesas, listando cada despesa de forma dinâmica

	despesas.forEach(function(d){

	//criando a linha - tr

			var linha = listaDespesas.insertRow();

	//Após criar a linha precisamos inserir os valores com as colunas - td
	//Usa innerHTML para colocar dentro da coluna/linha um determinado valor de uma variavel
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

	//ajustar o tipo - usar parseint caso esteja comparando string com int pois no case é usando o === então o tipo afeta, diferente do Php. Aqui vamos colocar nos case 'i' que é string então tá de boas pois no js os roles entram como string
	switch(d.tipo) {
		case '1': d.tipo = 'Alimentação'
		break
		case '2': d.tipo = 'Educação'
		break
		case '3': d.tipo = 'Lazer'
		break
		case '4': d.tipo = 'Saúde'
		break
		case '5': d.tipo = 'Transporte'
		break
	}

	linha.insertCell(1).innerHTML = d.tipo

	linha.insertCell(2).innerHTML = d.descricao
	linha.insertCell(3).innerHTML = d.valor

//Criar botão de exclusão

	let btn = document.createElement("button")
	btn.className = 'btn btn-danger'
	btn.innerHTML = '<i class="fas fa-times"></i>'
	
//Aqui estamos acessando o id do objeto e atribuindo ao id como o valor do botão
	btn.id = `id_despesa_${d.id}` //Para evitar conflitos na aplicação
	btn.onclick = function() {
	
	let id = this.id.replace('id_despesa_','')

	bd.remover(id)

	window.location.reload()

	}	

	linha.insertCell(4).append(btn)

	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value				

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)

}




