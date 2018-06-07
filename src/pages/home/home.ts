import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { NovoClientePage } from '../novo-cliente/novo-cliente'
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  clientes = [];
  grupoClientes = [];
  carregando = true;
  pesquisar: boolean = false;
  grupoClientesOrigin = [];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private http: Http
  ) {
    this.getClientes().then(() => {
      this.agruparClientes(this.clientes) //agrupar clientes por ordem alfabetica
    });
  }

  getClientes() {
    var promise = new Promise((resolve, reject) => {
      this.carregando = true //variavel responsavel por controlar a animação de 'carregando'

      this.clientes = []
      this.grupoClientes = []
    
      // GET lista de clientes
      this.http.get('https://api-agenda-clientes.herokuapp.com/clientes')
      .map((res: Response) => {
        let body = res.json();
        return body || {};
      })
      .subscribe(cli => {
        console.log(cli)
        this.clientes = cli
        this.carregando = false
        resolve();
      })
    });
    return promise;
  }

  agruparClientes(clientes){

    
    //ordenar clientes por nome
    let clientesOrdenados = clientes.sort(function(a,b) {
      return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
    });

    let letraAtual = false;
    let clientesAtuais = [];

    // Percorre o array de clientes para separa-los em grupos
    clientesOrdenados.forEach((value, index) => {

        if(value.nome.charAt(0) != letraAtual){

          letraAtual = value.nome.charAt(0);

          let novoCliente = {
            letra: letraAtual,
            cliente: []
          };

          clientesAtuais = novoCliente.cliente;
          this.grupoClientes.push(novoCliente);

        }
        clientesAtuais.push(value);
        
      });
  }

  reload() {
    this.getClientes().then(() => {
      this.agruparClientes(this.clientes)
    })
  }

  getItems(ev: any) {   // função responsável pela Pesquisa
    this.getClientes().then(()=> {   //atualiza os dados pegando novamente do banco
      // pega o texto digitado na searchbar
      let val = ev.target.value;
  
      // verifica se o valor é diferente de vazio e inicia o filtro
      if (val && val.trim() != '') {
        this.clientes = this.clientes.filter((item) => {
          return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
      this.grupoClientes = []
      // após filtrar, agrupa novamente por ordem alfabética
      this.agruparClientes(this.clientes) 
    });
  }

  newClient () {
    // abre o modal de novo cliente
    const modal = this.modalCtrl.create(NovoClientePage);

    // esta função será executada automaticamente quando o modal for fechado
    // o data retornara TRUE caso tenha sido cadastrado algum cliente
    // ou retornara FALSE caso o usuário tenha cancelado o cadastro
    modal.onDidDismiss(data => {
      if(data) {
        this.getClientes().then(() => {
          this.agruparClientes(this.clientes)
        })
      }
    });
    modal.present();
  }

  habilitarPesquisa() {
    this.grupoClientesOrigin = this.grupoClientes;
    this.pesquisar = true; 
    setTimeout(()=> {
      document.getElementById('input').focus()
    }, 0)
  }
  ocultarPesquisa() {
    this.pesquisar = false;
    this.grupoClientes = this.grupoClientesOrigin
  }

  // ao clicar em algum cliente, será chamada esta função para mostrar as opções de Editar, Excluir...
  presentActionSheet(grupo, cliente) {
    let key = this.grupoClientes[grupo].cliente[cliente].key
    const actionSheet = this.actionSheetCtrl.create({
      title: this.grupoClientes[grupo].cliente[cliente].nome,
      buttons: [
        {
          icon: 'create',
          text: 'Editar',
          handler: () => {
            // chama a tela de novo usuário, porem no modo de edição
            const modal = this.modalCtrl.create(NovoClientePage, { key: key});
            modal.onDidDismiss(data => {
              if(data) {
                this.getClientes().then(() => {
                  this.agruparClientes(this.clientes)
                })
              }
            });
            modal.present();
          }
        },{
          icon: 'trash',
          cssClass:'teste',
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.showConfirm(this.grupoClientes[grupo].cliente[cliente].key)
          }
        },{
          icon: 'close',
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // apresenta ALERT para confirmar a exclusão de um cliente
  showConfirm(key) {
    let confirm = this.alertCtrl.create({
      title: "Excluir Cliente?",
      message: 'Deseja realmente excluir este cliente?',
      buttons: [
        {
          text: 'NÃO',
          handler: () => {
            console.log('Negado');
          }
        },
        {
          text: 'SIM',
          handler: () => {
            this.deleteClient(key)
          }
        }
      ]
    });
    confirm.present();
  }

  // função de DELETE
  deleteClient (key) {
    this.http.delete('https://api-agenda-clientes.herokuapp.com/clientes/' + key)
    .map((res: Response) => {
      return res;
    })
    .subscribe(res => {
      console.log('res -> ', res)
      this.getClientes().then(() => {
        this.agruparClientes(this.clientes)
      })
    })

    
  }
}
