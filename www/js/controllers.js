angular.module('starter.controllers', [])

.service('rodadaService', function() {
    this.meusPalpites;
})

.service('rankingService', function () {
    this.rankings;
})

.service('bolaoService', function () {
    this.bolao;
})

.factory('urlService', function () {
    //return "http://localhost/penca/public/";
    return "http://www.bolaocraquedebola.com.br/public/";
})

.factory('dataService', ['$filter', 
    function ($filter) {
        return {
            data_format : function (data) {
                var dataFinal = "";
                var date = new Date(data);
                var dia = $filter('date')(date, 'EEE');
                var numDia = $filter('date')(date, 'dd');
                var mes = $filter('date')(date, 'MMM');
                var hora = $filter('date')(date, 'hh:mm');

                if (angular.equals(dia, "Mon")) {
                    dataFinal = "Seg.";
                }
                if (angular.equals(dia, "Tue")) {
                    dataFinal = "Ter.";
                }
                if (angular.equals(dia, "Wed")) {
                    dataFinal = "Qua.";
                }
                if (angular.equals(dia, "Thu")) {
                    dataFinal = "Qui.";
                }
                if (angular.equals(dia, "Fri")) {
                    dataFinal = "Sex.";
                }
                if (angular.equals(dia, "Sat")) {
                    dataFinal = "Sab.";
                }
                if (angular.equals(dia, "Sun")) {
                    dataFinal = "Dom.";
                }

                dataFinal = dataFinal + " " + numDia + " " + mes + " " + hora + "hs";

                return dataFinal;
            }
        }
    }])

.service('usuarioService', function () {
    var usuario;
    var senha;
    var dinheiro;
    var id;

    this.guardar = function (us, pass, din, id) {
        this.usuario = us;
        this.senha = pass;
        this.dinheiro = din;
        this.id = id;
    }

    this.getUsuario = function () {
        return usuario;
    }

    this.getSenha = function () {
        return senha;
    }

    this.getDinheiro = function () {
        return dinheiro;
    }
    this.getId = function () {
        return id;
    }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller("MenuCtrl", ['$scope', '$http', '$state', 'usuarioService', 
    function ($scope, $http, $state, usuarioService) {
        $scope.cash = usuarioService.dinheiro;
        

        $scope.logout = function () {
            usuarioService.guardar("", "", "");
            $state.go("login");
        }
}])

.controller('Palpites', ['$scope', '$http', '$state', '$filter', 'dataService', 'rodadaService', 'usuarioService', 'urlService', 'bolaoService',
        function($scope, $http, $state, $filter, dataService, rodadaService, usuarioService, urlService, bolaoService) {

    $http.get(urlService + 'mobile/celproximojogos/?')
    .success(function (data) {

        $scope.palpites = data;

        for (var i = 0; i < $scope.palpites.length; i = i + 1) {

            var dateDoJogo = dataService.data_format($scope.palpites[i].mt_date);

            var dataJogo = new Date($scope.palpites[i].mt_date);
            var dataAgora = new Date();

            var dataFinal = "";
            var date = new Date($scope.palpites[i].mt_date);
            var numDia = $filter('date')(date, 'dd');
            var mes = $filter('date')(date, 'MMM');

            var date1 = new Date();
            var numDiaHoje = $filter('date')(date1, 'dd');
            var mesHoje = $filter('date')(date1, 'MMM');


            var estado = "";
            var badget = "";
            var no_encerrado = true;
            if (numDia == numDiaHoje && mes == mesHoje) {
                estado = "Hoje";
                badget = "balanced";
            }

            if (dataJogo < dataAgora) {
                estado = "Encerrado";
                badget = "assertive";
                no_encerrado = false;
            }

            $scope.palpites[i].mt_date = dateDoJogo;
            $scope.palpites[i].estado = estado;
            $scope.palpites[i].badget = badget;
            $scope.palpites[i].no_encerrado = no_encerrado;
        }
    });

        $http.get(urlService + 'mobile/cellgetcampeonatos/?')
        .success(function (data) {
            $scope.campeonatos = data;
        });


        $scope.doRefresh = function () {
            alert("refersh");
            //$http.get('/new-items')
            // .success(function (newItems) {
            //     $scope.items = newItems;
            // })
            // .finally(function () {
            //     // Stop the ion-refresher from spinning
            //     $scope.$broadcast('scroll.refreshComplete');
            // });
        };


    $scope.setPalpite = function (p) {

        $state.go('app.detail', {
            mt_id: p.mt_id, tm1_logo: p.tm1_logo, tm2_logo: p.tm2_logo, t1nome: p.t1nome, t2nome: p.t2nome,
            ch_id: p.ch_id, ch_nome: p.ch_nome, mt_acumulado: p.mt_acumulado, mt_date: p.mt_date,
            mt_idround: p.mt_idround, mt_idteam1: p.mt_idteam1, mt_idteam2: p.mt_idteam2, mt_round: p.mt_round,
            rd_round : p.rd_round, no_encerrado : p.no_encerrado
        });

    };

    $scope.meuspalpitescampeonato = function (opcao) {
        $http.post(urlService + 'mobile/cellmeuspalpites', { champ: opcao, id: usuarioService.id })
            .success(function (data) {
                rodadaService.meusPalpites = data;
                $state.go("app.meuspalpitesrodadas");
            });
    }

    $scope.palpitarcampeonato = function (campeonato) {
        $http.post(urlService + '/mobile/cellbolao', { champ: campeonato.ch_id, id: usuarioService.id })
            .success(function (data) {
                bolaoService.bolao = data;
                $state.go("app.listjogosrodada");
            });
    }
}])

.controller('CadastroCtrl', function ($scope, $http, $state, urlService) {

    $scope.cadastro = function (user) {

        var certo = true;
        var mensaje = "";

        if (typeof user.usuario == "undefined") {
            certo = false;
            mensaje = "Nome do usuario nao pode ser vazio.";
        }
        if (typeof user.senha == "undefined") {
            certo = false;
            mensaje = "Senha incorrecta.";
        }
        if (typeof user.email == "undefined") {
            certo = false;
            mensaje = "Email nao pode ser vazio.";
        }
        if (user.niver == null) {
            certo = false;
            mensaje = "Aniversario nao pode ser vazio.";
        }

        if (certo) {
            mensaje = "";
            $http.post(urlService + 'mobile/celcadastro/?', { username: user.usuario, password: user.senha, email: user.email, niver: user.niver })
                .success(function (data) {
                    if (data == 200) {
                        alert("cadastro_certo");
                    } else {
                        alert("cadastro_errado");
                    }
                });
        } else {
            $scope.error = mensaje;
        }
    }

    $scope.voltarinicio = function () {
        $state.go("login");
    }
})

.controller('MeusPalpitesCtrl', ['$scope', '$http', '$state', '$stateParams', '$filter', '$ionicPopup', 'rodadaService','dataService', 'usuarioService','urlService',
    function ($scope, $http, $state, $stateParams, $filter, $ionicPopup, rodadaService, dataService, usuarioService, urlService) {
        $scope.rodadaService = rodadaService;
        $scope.ch_nome = $stateParams.ch_nome;
        $scope.rodadas = rodadaService.meusPalpites.rondas;
        $scope.n_rodada = rodadaService.meusPalpites.n_rodada;
        $scope.palpites = rodadaService.meusPalpites.palpites;
        $scope.champ = rodadaService.meusPalpites.champ;

        console.log($scope.palpites);

        for (var i = 0; i < $scope.rodadaService.meusPalpites.palpites.length; i = i + 1) {
            var date = new Date($scope.rodadaService.meusPalpites.palpites[i].mt_date);
            $scope.rodadaService.meusPalpites.palpites[i].mt_date = dataService.data_format(date);
            $scope.rodadaService.meusPalpites.palpites[i].vivo = true;
        }

        var nombreDeLaRodada = "";
        for (var i = 0; i < $scope.rodadaService.meusPalpites.rondas.length; i = i + 1) {
            var rodadaActual = $scope.n_rodada;
            var rodadaActualIt = $scope.rodadaService.meusPalpites.rondas[i].rd_id;
            if (angular.equals(rodadaActualIt, rodadaActual)) {                
                nombreDeLaRodada = $scope.rodadaService.meusPalpites.rondas[i].rd_round;
            }

        }

        var nombreDelCampeonato = "";
        for (var i = 0; i < $scope.rodadaService.meusPalpites.championships.length; i = i + 1) {
            var campeonato = $scope.champ;
            var campeonatoIt = $scope.rodadaService.meusPalpites.championships[i].ch_id;

            if (angular.equals(campeonato, campeonatoIt)) {
                nombreDelCampeonato = $scope.rodadaService.meusPalpites.championships[i].ch_nome;
            }
        }

        $scope.n_rodada_nome = nombreDeLaRodada;
        $scope.champ_nome = nombreDelCampeonato;
        $scope.rodada_sel = $scope.rodadas[2];

        $scope.selecionarRodada = function () {
            alert($scope.selectedItem.id);
        }

        $scope.rankingrodada = function(mt_round) {
            alert(mt_round);
        }

        $scope.palpitesjogo = function (mt_id) {
            alert(mt_id);
        }

        $scope.editarpalpite = function (p) {
            $state.go('app.detail', {
                mt_id: p.mt_id, tm1_logo: p.tm1_logo, tm2_logo: p.tm2_logo, t1nome: p.t1nome, t2nome: p.t2nome,
                ch_id: p.ch_id, ch_nome: p.ch_nome, mt_acumulado: p.mt_acumulado, mt_date: p.mt_date,
                mt_idround: p.mt_idround, mt_idteam1: p.mt_idteam1, mt_idteam2: p.mt_idteam2, mt_round: p.mt_round,
                rd_round: p.rd_round, encerrado: p.encerrado
            });
        }

        $scope.trocarrodada = function (rodada) {
            $http.post(urlService + 'mobile/cellmeuspalpites', { champ: rodada.rd_idchampionship, id: usuarioService.id, rodada : rodada.rd_id })
                .success(function (data) {
                    rodadaService.meusPalpites = data;
                    $state.go("app.blanco");
            });
        }

        // Triggered on a button click, or some other target
        $scope.apagar = function (rs_id, ch_id, rd_id, mt_id) {
            $scope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template:'Deseja apagar o palpite?',
                title: 'Apagar palpite',
                scope: $scope,
                buttons: [                  
                  {
                      text: '<b>Sim</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                            $http.post(urlService + 'mobile/cellexcluirpalpite', { result: rs_id, champ: ch_id, round: rd_id, match: mt_id, user_id : usuarioService.id })
                                .success(function (data) {
                                    console.log(data);
                                    for (var i = 0; i < $scope.rodadaService.meusPalpites.palpites.length; i = i + 1) {
                                        if ($scope.rodadaService.meusPalpites.palpites[i].rs_id == rs_id) {
                                            $scope.rodadaService.meusPalpites.palpites[i].vivo = false;

                                        }
                                    }
                            });
                      }
                  },
                  { text: 'No' }
                ]
            });

            //myPopup.then(function (res) {
            //    $http.post(urlService + 'mobile/cellexcluirpalpite', { result : rs_id, champ: ch_id, round: rd_id, match: mt_id })
            //        .success(function (data) {
            //            console.log(retorno);
            //        });
            //    console.log('Tapped!', res);
            //});

        };

        // A confirm dialog
        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Consume Ice Cream',
                template: 'Are you sure you want to eat this ice cream?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // An alert dialog
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Don\'t eat that!',
                template: 'It might taste good'
            });

            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

    }])



.controller('LoginCtrl', function ($scope, $http, $state, usuarioService, urlService) {
    $scope.login = function () {
        $http.post(urlService + 'mobile/cellogin/?', { us: 'mdymen', pass: '3345531' }/* { us: $scope.login.usuario, pass: $scope.login.senha }*/)
            .success(function (data) {
                if (!data) {
                    alert("error");
                } else {
                    $scope.time = data;
                    usuarioService.guardar(data.us_username, data.us_password, data.us_cash, data.us_id);
                    $scope.cash = data.us_cash;
                    

                    $state.go('app.list');
                }
         });

    }

})




.controller('JogoCtrl', function ($scope, $http, $stateParams, $state, dataService, rankingService, urlService) {
    $scope.t1nome = $stateParams.t1nome;
    $scope.t2nome = $stateParams.t2nome;
    $scope.tm1_logo = $stateParams.tm1_logo;
    $scope.tm2_logo = $stateParams.tm2_logo;
    $scope.ch_nome = $stateParams.ch_nome;
    $scope.mt_date = $stateParams.mt_date; 
    $scope.mt_id = $stateParams.mt_id;
    $scope.mt_idround = $stateParams.mt_idround;
    $scope.ch_id = $stateParams.ch_id;
    $scope.rd_round = $stateParams.rd_round;
    $scope.no_encerrado = $stateParams.no_encerrado;   

    $scope.realizar_palpite = function (palpite, mt_id, mt_idround, ch_id) {
        $http.post(urlService + 'mobile/cellsubmeterpalpite/?', { result1: palpite.rs_res1, result2: palpite.rs_res2, match: mt_id, round: mt_idround, champ: ch_id })
            .success(function (data) {
                $state.go('app.list');
       });
    }

    $scope.ranking_campeonato = function (ch_id) {
        $http.post(urlService + 'mobile/cellrankingcampeonato?', { champ: ch_id })
            .success(function (data) {
                rankingService.rankings = data;
                $state.go('app.ranking');
            });
    };

    $scope.ranking_rodada = function (ch_id, rd_id) {
        $http.post(urlService + 'mobile/cellrankinground?', { champ: ch_id, round: rd_id })
            .success(function (data) {
                rankingService.rankings = data;
                $state.go('app.rankingrodada');
        });
    }
})

.controller('RankingCtrl', function ($scope, $http, $stateParams, $state, dataService, rankingService) {

    var nome_champ = "";
    for (var i = 0; i < rankingService.rankings.length; i = i + 1) {
        rankingService.rankings[i].i = i + 1;
        nome_champ = rankingService.rankings[i].ch_nome;
        rankingService.rankings[i].mt_date = dataService.data_format(rankingService.rankings[i].mt_date);
    }

    $scope.rankings = rankingService.rankings;
    $scope.ch_nome = nome_champ;

})

.controller('BlancoCtrl', function ($scope, $state, rodadaService) {
    console.log("ENTROU");
    console.log(rodadaService);
    $state.go('app.meuspalpitesrodadas');
})

.controller('ListaJogosRodadaCtrl', function ($scope, $http, $stateParams, $state, $filter, bolaoService, dataService) {
    $scope.dados = bolaoService.bolao;

    for (var i = 0; i < $scope.dados.rodada.length; i = i + 1) {

        var dateDoJogo = dataService.data_format($scope.dados.rodada[i].mt_date);


        var dataJogo = new Date($scope.dados.rodada[i].mt_date);
        var dataAgora = new Date();

        var dataFinal = "";
        var date = new Date($scope.dados.rodada[i].mt_date);
        var numDia = $filter('date')(date, 'dd');
        var mes = $filter('date')(date, 'MMM');

        var date1 = new Date();
        var numDiaHoje = $filter('date')(date1, 'dd');
        var mesHoje = $filter('date')(date1, 'MMM');

        var resultado_marcado = false;
        if ($scope.dados.rodada[i].rs_res1 != null) {
            resultado_marcado = true;
        }



        var estado = "";
        var badget = "";
        var no_encerrado = true;
        if (numDia == numDiaHoje && mes == mesHoje) {
            estado = "Hoje";
            badget = "balanced";
        }

        if (dataJogo < dataAgora) {
            estado = "Encerrado";
            badget = "assertive";
            no_encerrado = false;
        }
        $scope.dados.rodada[i].ch_nome = $scope.dados.championship.ch_nome;
        $scope.dados.rodada[i].mt_date = dateDoJogo;
        $scope.dados.rodada[i].estado = estado;
        $scope.dados.rodada[i].badget = badget;
        $scope.dados.rodada[i].no_encerrado = no_encerrado;
        $scope.dados.rodada[i].resultado_marcado = resultado_marcado;
    }

    $scope.setPalpite = function (p) {
        $state.go('app.detail', {
            mt_id: p.mt_id, tm1_logo: p.tm1_logo, tm2_logo: p.tm2_logo, t1nome: p.t1nome, t2nome: p.t2nome,
            ch_id: p.ch_id, ch_nome: p.ch_nome, mt_acumulado: p.mt_acumulado, mt_date: p.mt_date,
            mt_idround: p.mt_idround, mt_idteam1: p.mt_idteam1, mt_idteam2: p.mt_idteam2, mt_round: p.mt_round,
            rd_round: p.rd_round, no_encerrado: p.no_encerrado
        });
    }

})