import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Generated class for the NovoClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-novo-cliente',
  templateUrl: 'novo-cliente.html',
})
export class NovoClientePage {
  @ViewChild(Content) content: Content;
  nome: String;
  telefone: String;
  email: String;
  editar: boolean = false;
  key: number = 0;
  title: String = 'Novo Cliente';
  titleBtn: String = 'Adicionar Cliente';
  cor: String;
  opcoesCor: Array<String> = [
                              '#C398DD', '#88A8D7', '#85D581', 
                              '#D68A85', '#1C5450', '#A4378D', 
                              '#BABAE8', '#24BF43', '#E5D638', 
                              '#E88317', '#B50D18', '#EF15FF']

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private http: Http,
    params: NavParams
  ) {
    // verifica se foi passado como parametro o cliente
    // se foi, significa que é uma edição, se não, é uma criação
    if(params.data.key) {
      this.getClientById(params.data.key)
    } else {
      // sorteia uma nova cor :)
      let sort = Math.floor((Math.random() * 12))
      this.cor = this.opcoesCor[sort]
    }
    this.ajustarScroll()
  }

  //get cliente por ID
  getClientById (key) {
    this.http.get('https://api-agenda-clientes.herokuapp.com/clientes/' + key)
    .map((res: Response) => {
      return res.json();
    })
    .subscribe(res => {
      this.nome = res.nome,
      this.telefone = res.telefone ? res.telefone : '';
      this.email = res.email ? res.email : '';
      this.key = parseInt(key);
      this.cor = res.cor;
      this.editar = true;
      this.title = 'Editar Cliente';
      this.titleBtn = 'Salvar Cliente';
    })
  }

  // funçaõ para adicionar um novo cliente, ou salvar caso seja uma edição
  addClient () {
    if(this.editar) {

      // PUT (update cliente)
      this.http.put('https://api-agenda-clientes.herokuapp.com/clientes/' + this.key, {
        nome: this.nome,
        telefone: this.telefone,
        email: this.email,
        cor: this.cor
      })
      .map((res: Response) => {
        return res;
      })
      .subscribe(res => {
        if(res.status === 200) { 
          this.viewCtrl.dismiss(true);
        }
      })
    } else {
      // POST (create)
      this.http.post('https://api-agenda-clientes.herokuapp.com/clientes', {
        nome: this.nome,
        telefone: this.telefone,
        email: this.email,
        cor: this.cor
      })
      .map((res: Response) => {
        return res;
      })
      .subscribe(res => {
        if(res.status === 201) {
          this.viewCtrl.dismiss(true);
        }
      })
      
    }
    // fecha o modal enviando true (gravou um novo cliente)
    this.viewCtrl.dismiss(true);
  }

  dismiss() {
    // fecha o modal cancelando a inclusão de novo cliente 
    this.viewCtrl.dismiss(false);
  }

  formatTel(){
    // aqui utiliza-se regex para criar uma mascara de telefone para o campo
    this.telefone=this.telefone.replace(/[^\d]+/g,'');             //Remove tudo o que não é dígito
    this.telefone=this.telefone.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    this.telefone=this.telefone.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
  }

  scrollToTop() {
    if(this.content._scroll){
      this.content.scrollToTop();
    }
  }

  ajustarScroll() {
    let aux = document.getElementsByClassName('input-has-focus')
    if(aux.length > 0) {
      this.scrollToTop()
    }
    setTimeout(()=> {
      this.ajustarScroll()
    }, 1000)
  }
}
