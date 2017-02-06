angular.module('starter.controllers', [])

.service('rodadaService', function() {
    this.meusPalpites;
})

.service('rankingService', function () {
    this.rankings;
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
        console.log('Doing login', $scope.loginData);

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
        //console.log(usuarioService.dinheiro);
        $scope.cash = usuarioService.dinheiro;

    //    $http.post('http://localhost/penca/public/mobile/cellogin/?', { us: "mdymen", pass: "3345531" })
    //.success(function (data) {
    //    $scope.time = data;
    //    usuarioService.guardar(data.us_username, data.us_password, data.us_cash);
    //    $scope.cash = data.us_cash;
    //    console.log(data);
    //});
        

        $scope.logout = function () {
            usuarioService.guardar("", "", "");
            $state.go("login");
        }
}])

.controller('Palpites', ['$scope', '$http', '$state', '$filter', 'dataService', 'rodadaService', 'usuarioService',
        function($scope, $http, $state, $filter, dataService, rodadaService, usuarioService) {


    $http.get('http://www.bolaocraquedebola.com.br/public/mobile/celproximojogos/?')
    .success(function (data) {

        console.log(data);
        $scope.palpites = data;

        for (var i = 0; i < $scope.palpites.length; i = i + 1) {

            var dateDoJogo = dataService.data_format($scope.palpites[i].mt_date);
            console.log(date);

            var dataJogo = new Date($scope.palpites[i].mt_date);
            var dataAgora = new Date();

            //if (i == 0) {
            //    alert(dataJogo);
            //    alert(dataAgora);
            //}

            var dataFinal = "";
            var date = new Date($scope.palpites[i].mt_date);
            var numDia = $filter('date')(date, 'dd');
            var mes = $filter('date')(date, 'MMM');

            var date1 = new Date();
            var numDiaHoje = $filter('date')(date1, 'dd');
            var mesHoje = $filter('date')(date1, 'MMM');


            var estado = "";
            var badget = "";
            if (numDia == numDiaHoje && mes == mesHoje) {
                estado = "Hoje";
                badget = "balanced";
            }

            if (dataJogo < dataAgora) {
                estado = "Encerrado";
                badget = "assertive";
            }



            $scope.palpites[i].mt_date = dateDoJogo;
            $scope.palpites[i].estado = estado;
            $scope.palpites[i].badget = badget;
            //console.log($scope.palpites[i].mt_date);
        }
    });

    $http.get('http://www.bolaocraquedebola.com.br/public/mobile/cellgetcampeonatos/?')
        .success(function (data) {
            //console.log("campeonatos");
            //console.log(data);
            $scope.campeonatos = data;
            console.log($scope.campeonatos);
        });

    $scope.setPalpite = function (p) {

        console.log(p.mt_date);

        $state.go('app.detail', {
            mt_id: p.mt_id, tm1_logo: p.tm1_logo, tm2_logo: p.tm2_logo, t1nome: p.t1nome, t2nome: p.t2nome,
            ch_id: p.ch_id, ch_nome: p.ch_nome, mt_acumulado: p.mt_acumulado, mt_date: p.mt_date,
            mt_idround: p.mt_idround, mt_idteam1: p.mt_idteam1, mt_idteam2: p.mt_idteam2, mt_round: p.mt_round,
            rd_round : p.rd_round
        });
        //console.log(p);

    };

    $scope.meuspalpitescampeonato = function (opcao) {
        console.log(usuarioService.id);
        $http.post('http://www.bolaocraquedebola.com.br/public/mobile/cellmeuspalpites', {champ : opcao, id : usuarioService.id})
            .success(function (data) {
                //console.log(data);
                //$scope.rounds = data.rondas;
                //$scope.teams = data.teams;
                //console.log($scope.teams.
                console.log(data);
                rodadaService.meusPalpites = data;
                $state.go("app.meuspalpitesrodadas");
            });
    }
}])

.controller('CadastroCtrl', function ($scope, $http) {

    $scope.cadastro = function () { 
        $http.post('http://localhost/penca/public/mobile/celcadastro/?', { username: $scope.user.usuario, password: $scope.user.senha, email: $scope.user.email })
            .success(function (data) {
                //console.log(data);
            });
    }
})

.controller('MeusPalpitesCtrl', ['$scope', '$http', '$state', '$stateParams', '$filter', 'rodadaService',
    function ($scope, $http, $state, $stateParams, $filter, rodadaService) {
        $scope.rodadaService = rodadaService;
        //console.log($scope.rodadaService);
        $scope.ch_nome = $stateParams.ch_nome;
        $scope.rodadas = rodadaService.meusPalpites.rondas;
        $scope.n_rodada = rodadaService.meusPalpites.n_rodada;
        $scope.palpites = rodadaService.meusPalpites.palpites;
        $scope.champ = rodadaService.meusPalpites.champ;

        for (var i = 0; i < $scope.rodadaService.meusPalpites.palpites.length; i = i + 1) {
            var date = new Date($scope.rodadaService.meusPalpites.palpites[i].mt_date);

            //console.log($scope.rodadaService.meusPalpites.palpites[i]);

            $scope.rodadaService.meusPalpites.palpites[i].mt_date = $filter('date')(date, 'dd/MM/yy')
            //console.log($scope.palpites[i].mt_date);
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

            console.log(campeonato + " " + campeonatoIt);
            if (angular.equals(campeonato, campeonatoIt)) {
                nombreDelCampeonato = $scope.rodadaService.meusPalpites.championships[i].ch_nome;
                console.log("nomebre " + nombreDelCampeonato);
            }
        }

        $scope.n_rodada_nome = nombreDeLaRodada;
        $scope.champ_nome = nombreDelCampeonato;
        console.log($scope.palpites);

        $scope.items = [
   { id: 1, name: 'foo' },
   { id: 2, name: 'bar' },
   { id: 3, name: 'blah' }
        ];

        $scope.selecionarRodada = function () {
            alert($scope.selectedItem.name);
        }

    }])

.controller('LoginCtrl', function ($scope, $http, $state, usuarioService) {
    //$state.go('app.list');

    //$state.go('app.list');

    $scope.login = function () {
    $http.post('http://www.bolaocraquedebola.com.br/public/mobile/cellogin/?', { us: 'mdymen', pass: '3345531' }/* { us: $scope.login.usuario, pass: $scope.login.senha }*/)
            .success(function (data) {
                if (!data) {
                    alert("error");
                } else {
                    $scope.time = data;
                    console.log(data);
                    usuarioService.guardar(data.us_username, data.us_password, data.us_cash, data.us_id);
                    $scope.cash = data.us_cash;
                    

                    $state.go('app.list');
                }
         });

    }

})




.controller('JogoCtrl', function ($scope, $http, $stateParams, $state, dataService, rankingService) {
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

    $scope.realizar_palpite = function (palpite, mt_id, mt_idround, ch_id) {
        $http.post('http://www.bolaocraquedebola.com.br/public/mobile/cellsubmeterpalpite/?', { result1: palpite.rs_res1, result2: palpite.rs_res2, match: mt_id, round: mt_idround, champ: ch_id })
            .success(function (data) {
                $state.go('app.list');
       });
    }

    $scope.ranking_campeonato = function (ch_id) {
        $http.post('http://www.bolaocraquedebola.com.br/public/mobile/cellrankingcampeonato?', { champ: ch_id })
            .success(function (data) {
                rankingService.rankings = data;
                $state.go('app.ranking');
            });
    };
})

.controller('RankingCtrl', function ($scope, $http, $stateParams, $state, dataService, rankingService) {

    var nome_champ = "";
    for (var i = 0; i < rankingService.rankings.length; i = i + 1) {
        rankingService.rankings[i].i = i + 1;
        nome_champ = rankingService.rankings[i].ch_nome;
    }

    $scope.rankings = rankingService.rankings;
    $scope.ch_nome = nome_champ;

    console.log(rankingService.rankings);

})