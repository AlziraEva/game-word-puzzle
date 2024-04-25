buzz.defaults.formats = [ 'ogg', 'mp3' ]; // define os formatos de arquivos de audio que a biblioteca buzz tentará carregar nessa ordem.
buzz.defaults.preload = 'metadata'; // define que apenas os arquivos de audio devem ser carregados quando a página é carregada, mas o conteúdo do audio só deve  ser executado até ser solicitado pelo usuario (clicando em um botão)

var games = [ // contém informações sobre os animais do jogo
    { img: 'img/koala.png', color:'#176580', word: 'koala', sound: '' }, // informações sobre cada animal
    { img: 'img/elephant1.png', color:'#a36513', word: 'elephant', sound: 'sounds/elephant' },
    { img: 'img/monkey.png', color:'#ffc48b', word: 'monkey', sound: 'sounds/monkey' },
    { img: 'img/bear.png', color:'#807148', word: 'bear', sound: 'sounds/bear' },
    { img: 'img/horse.png', color:'#bc9e6c', word: 'horse', sound: 'sounds/horse' },
    { img: 'img/bull.png', color:'#ff5f09', word: 'bull', sound: 'sounds/bull' },
    { img: 'img/rabbit.png', color:'#c81f27', word: 'rabbit', sound: '' },
    { img: 'img/tiger.png', color:'#b3eef4', word: 'tiger', sound: 'sounds/meow' },
    { img: 'img/turtle.png', color:'#d5ea86', word: 'turtle', sound: '' },
    { img: 'img/lion1.png', color:'#dd992d', word: 'lion', sound: 'sounds/lion' },
    { img: 'img/cicada.png', color:'#008000', word: 'cicada', sound: 'sounds/cicada' },
    { img: 'img/fox.png', color:'#ffa500', word: 'fox', sound: 'sounds/fox' },
    { img: 'img/pork.png', color:'#ffb6c1', word: 'pork', sound: 'sounds/pork' },
    { img: 'img/whale.png', color:'#add8e6', word: 'whale', sound: 'sounds/whale' },
    { img: 'img/snake.png', color:'#006400', word: 'snake', sound: 'sounds/snake' },
    { img: 'img/fish.png', color:'#3232CD', word: 'fish', sound: 'sounds/fish' },
    { img: 'img/frog.png', color:'#90ee90', word: 'frog', sound: 'sounds/frog' },
    { img: 'img/dolphin.png', color:'#00ffff', word: 'dolphin', sound: 'sounds/dolphin' },
    { img: 'img/shark.png', color:'#87cefa', word: 'shark', sound: 'sounds/shark' },
    { img: 'img/owl.png', color:'#9f5927', word: 'owl', sound: 'sounds/owl' },
    
];

var winSound        = new buzz.sound('sounds/win' ), // instancia em que é associado o som da vitoria 
    errorSound      = new buzz.sound('sounds/error' ), // instancia que é associado o som da derrota
    alphabetSounds  = {}, // ira armazenar os sons associados a cada letra do alfabeto
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split( '' ); // irá retornar um array contendo as letras do alfabeto

for( var i in alphabet ) {
    var letter = alphabet[ i ];
    alphabetSounds[ letter ] = new buzz.sound('sounds/kid/'+ letter ); // um novo objeto de som é criado para cada letra do alfabeto, e sendo armazenado no objeto 'alphabetSounds '
}

$( function() { // é usado para garantir que o código dentro da função será executado, somente após o documento html ser todo carregado
    if ( !buzz.isSupported() ) { // verifica se a biblioteca 'Buzz' é suportada pelo navegador
        $('#warning').show(); // caso a biblioteca não seja suportada irá exibir o elemento 'html da tag com id='#warning', a função show() irá  exibir os elemento ocultos.
    }

    var idx = 0,
        $container  = $( '#container' ), // seleciona o elemento html e o armazena na váriavel
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' );

    $( 'body' ).bind('selectstart', function() { // seleciona o elemento 'body' do 'html', vincula o evento 'selectstart' a esse elemento, o 'selectstart' é acionado quando o usuario inicia a seleção de texto no elemento.
        return false // quando o usuario iniciar a seleção de texto o evento 'selectstart' é cancelado e a seleção de texto não é permitida
    });

    $( '#next' ).click( function() {
        refreshGame();
        buildGame( ++idx ); // construção do jogo de acordo com seu idx(incrementa +1 no idx) idx(numero da página)
        return false;
    });

    $( '#previous' ).click( function() {
       refreshGame();
       buildGame( --idx ); // construção do jogo de acordo com seu idx(decrementa -1 no idx)
       return false;
    });

    $( '#level' ).click( function() {
        if ( $( this ).text() == 'easy' ) {
            $( this ).text( 'hard' );
            $models.addClass( 'hard' ); // adiciona ao css a classe 'hard fazendo com que as letras desaparesa
        } else {
            $( this ).text( 'easy' );
            $models.removeClass( 'hard' ); // remove a classe 'hard' do css - fazendo com que as letras voltem a aparecer
        }
        return false;
    });

    function refreshGame() {
        $( '#models' ).html( '' ); // limpa toda as alterações da página anterior
        $( '#letters' ).html( '' );
    }

    function buildGame( x ) {
        if ( x > games.length - 1 ) { // caso o número da página for maior do que o total dos itens do objeto 'Games'
            idx = 0; // volta para a página inicial 
        }
        if ( x < 0 ) { // caso o idx for menor do que 0
            idx = games.length - 1; // volta para a ultima página
        }

        var game  = games[ idx ], // atribui o valor de só uma lista do objeto 'GAMES'
            score = 0;

        var gameSound = new buzz.sound( game.sound ); // pega a propriedade sound da lista que foi selecionada
        gameSound.play(); // utiliza o método play() da biblioteca buzz

        // Fade the background color
        $( 'body' ).stop().animate({
            backgroundColor: game.color // a cor da página será igual a cor passada da lista do 'Games'
        }, 1000);
        $( '#header' ).stop().animate({ //retirado o 'a' pois não tinha nada no html em relação a essa tag
            color: game.color // Muda a cor do texto de acordo com a lista do 'games'
        }, 1000);

        // Update the picture
        $picture.attr( 'src', game.img ) // está definindo o atributo src com uma nova imagem
            .unbind( 'click' ) // remove qualquer manipulador de evento 'clique'
            .bind( 'click', function() { // associa um novo manipulador de eventos 'clique',
                gameSound.play(); // quando esse elemento é clicado, ele inicia o som associado a imagem selecionada.
            });

        // Build model
        var modelLetters = game.word.split( '' ); // pega o nome do animal e separa de acordo com o espaço entre as letras

        for( var i in modelLetters ) { // é realizado um loop pegando cada letra do nome do animal
            var letter = modelLetters[ i ]; // é passada para variavel 'letter' casa letra do nome do animal
            $models.append( '<li>' + letter + '</li>' ); // adiciona um elemento (uma letra) do nome do animal a lista
        }

        var letterWidth = $models.find( 'li' ).outerWidth( true ); // com o find('li') procura todos os elementos li dentro do 'models'
        // o outerWidth( true ) retorna a largura total do elemento

        $models.width( letterWidth * $models.find( 'li' ).length ); //width é usado para definir a largura do elemento, ( multiplica-se a largura de cada item 'li' pelo número total de itens. )

        // Build shuffled letters
        var letters  = game.word.split( '' ), // separa cada letra do nome do animal
            shuffled = letters.sort( function() { return Math.random() < 0.5 ? -1 : 1 }); // o sort() é usado para ordenar elementos de um array
            // Math.random()  retorna um elemento número aleatorio de 0 a 1, como resultado ira embaralhar as letras do nome.

        for( var i in shuffled ) {
            $letters.append( '<li class="draggable">' + shuffled[ i ] + '</li>' ); // adiciona a tag 'li' com a letra do nome do animal de forma aleatoria
        }

        $letters.find( 'li' ).each( function( i ) { // processo para percorrer cada elemento '<li>' e executar uma funcao para cada um deles
            var top   = ( $models.position().top ) + ( Math.random() * 100 ) + 80, //  position() - retorna a posição do primeiro elemento.
            // é indicada uma posição aleatoria ao elemento
                left  = ( $models.offset(). left - $container.offset().left ) + ( Math.random() * 20 ) + ( i * letterWidth ),
                // Calcula a posição horizontal do elemento 'models' em relação ao 'container, levando em consideração o deslocamento aleatorio  com base na largura da letra

                angle = ( Math.random() * 30 ) - 10; // define o angulo para girar ou inclinar o elemento na tela
            $( this ).css({
                top:  top  + 'px',
                left: left + 'px'
            });

            rotate( this, angle );

            $( this ).mousedown( function() {
                // evento de clicar no mouse 
                var letter = $( this ).text(); // obtem o texto do elemento atual
                if ( alphabetSounds[ letter ] ) // se ouver um som associado ao texto
                {
                    alphabetSounds[ letter ].play(); // o som associado é chamado para ser reproduzido
                } 
            });
        });

        $letters.find( 'li.draggable' ).draggable({ // seleciona todos os elementos 'li' com a classe = 'draggable' e com 'draggable()' os torna arrastaveis.
            zIndex: 9999, // garante que os elementos arratais fiquem acima dos outros elementos '<li>'
            stack: '#letters li' // especifica que os elementos arrastaveis empilham-se sobre outros elementos, ficando ele no topo da pilha
        });

        $models.find( 'li' ).droppable( { // comportamento de soltar elementos
            accept:     '.draggable', // elementos <li> serão alvos de soltura apenas de elementos da classe '.draggable'.
            hoverClass: 'hover', // define uma classe css chamada 'hover', e quando um elemento estiver sendo arrastrado ele será estilizado visualmente.
            drop: function( e, ui ) {
                var modelLetter      = $( this ).text(), // obtem um texto de onde o elemento arrastavel foi solto
                    droppedLetter = ui.helper.text(); // obtem o texto do elemento que está sendo solto

                if ( modelLetter == droppedLetter ) { // verifica se o modelLetter é igual ao elemento arrastavel que foi aolto (droppedLetter)
                    ui.draggable.animate( { // anima o elemento arrastavel
                        top:     $( this ).position().top,
                        left:     $( this ).position().left // define que o elemento que foi solto tem que está na mesma posição do elemento onde ele foi solto
                    } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true ); // remove e desabilidade a funcionalidade de arrastar o elemento
                    
                    rotate( ui.draggable, 0 );
                    
                    score++;
                    
                    if ( score == modelLetters.length ) {
                        winGame(); // se completar as letras, ele vence o jogo
                    }    
                } else {
                    ui.draggable.draggable( 'option', 'revert', true ); // faz a letra voltar para sua posição inical antes de ser arrastrada
                    
                    errorSound.play(); // som de erro é acionado
                    
                    setTimeout( function() {
                        ui.draggable.draggable( 'option', 'revert', false ); // define que após o elemento ser solto, ele não volta para sua posição inicial
                    }, 100 );
                }
            }
        });
    }

    function winGame() { // será chamada quando o jogador ganhar o jogo
        winSound.play(); // audio que contem a vitoria

        $( '#letters li' ).each( function( i ) 
        // seleciona todos os elementos li e executa uma função para cada elemento, o parametro (i) é o indice de cada elemento
        {
            var $$ = $( this ); // cria uma variavel local que armazena uma referencia ao elemento 'li' atual
            setTimeout( function() {
                $$.animate({
                    top:'+=60px' // cada letra do bixinho se move para baixo
                });
            }, i * 300 ); // cada item vai se mover com atraso em relação ao anterior
        });

        setTimeout( function() {
            refreshGame(); // atualiza ou reinicia o jogo
            buildGame( ++idx ); // construir e preparar o proximo jogo
        }, 3000);
    }

    function rotate( el, angle ) { // define 2 elementos - o html a ser rotacionado('el') e o angulo da rotação('angle)
        $( el ).css({ // seleciona o elemento 'el' e define a propriedade de estilo CSS
            '-webkit-transform': 'rotate(' + angle + 'deg)', // tipos dos navegadores que poderão ser suportados
            '-moz-transform': 'rotate(' + angle + 'deg)', 
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    buildGame( idx ); // construir novo jogo de acordo com esse 'idx'
});