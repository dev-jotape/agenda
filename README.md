# Agenda de Clientes

Para utilizar o app siga os passos abaixo:

__IMPORTANTE__: 
Ter primeiramente o NODE instalado (https://nodejs.org/en/)
Da mesma forma, ter o IONIC instalado (`npm install -g ionic cordova`)

Passos:

- Faça o download do repositório: `git clone https://github.com/joaopedro1206/agenda.git`
- Navegue até a pasta: `cd agenda`
- Instale as dependencias: `npm install`
- Rodando o comando `ionic serve` irá subir a aplicação localmente, sendo visualizada no próprio navegador.

Para debugar no celular, basta realizar os seguintes comandos:
- `ionic cordova platform add android` (adiciona a plataforma android)
- `ionic cordova run android` (debug no aparelho que estiver conectado via USB)

Para gerar o APK:
- `ionic cordova build android`