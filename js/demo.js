// Configurações padrão para a biblioteca Buzz.js
buzz.defaults.formats = ['ogg', 'mp3']; 
buzz.defaults.preload = 'metadata'; 

// Informações sobre os animais do jogo
var games = [ 
    { img: 'img/koala.png', color:'#176580', word: 'koala', sound: '' }, 
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

// Função para criar instâncias de som
function createSound(src) {
    return new buzz.sound(src);
}

// Sons associados a cada letra do alfabeto
const alphabetSounds = {};

// Letras do alfabeto
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Associar sons a cada letra do alfabeto
alphabet.forEach(letter => {
    alphabetSounds[letter] = createSound(`sounds/kid/${letter}`);
});

// Instâncias de som para vitória e erro
const winSound = createSound('sounds/win');
const errorSound = createSound('sounds/error');

$(function() {
    // Verifica se a biblioteca 'Buzz' é suportada pelo navegador
    if (!buzz.isSupported()) {
        $('#warning').show(); // Exibe o elemento com id='warning'
    }

    // idx ainda precisa ser definido para o restante do código
    var idx = 0,
        // Seleciona os elementos HTML e armazena-os em variáveis
        $container  = $( '#container' ), 
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' ),
        $body       = $( 'body' ),
        $next       = $( '#next' ),
        $previus    = $( '#previous' ),
        $level      = $('#level')
        $header     = $('#header')


    // Impede a seleção de texto no corpo do documento
    $body.on('selectstart', function() {
        return false;
    });

    // Atualiza o jogo e avança para o próximo índice
    $next.click(function() {
        refreshGame()
        buildGame(++idx);
        return false; // bloqueia a ação padrão do link
    });

    // Atualiza o jogo e retrocede para o índice anterior
    $previus.click( function() {
       refreshGame();
       buildGame( --idx ); 
       return false;
    });

    // Alterna entre os níveis de dificuldade
    $level.click(function() {
        var $this = $(this);
        var newText = $this.text() === 'easy' ? 'hard' : 'easy';
        $this.text(newText);
        $models.toggleClass('hard');
        return false;
    });

    // limpa toda as alterações da página anterior
    function refreshGame() {
        $models.html( '' ); 
        $letters.html( '' );
    }

    

    // Construção do jogo
    function buildGame( x ) {


        if ( x > games.length - 1 ) { 
            idx = 0; 
        }
        if ( x < 0 ) {
            idx = games.length - 1; 
        }

        var game  = games[ idx ],
            score = 0; 
    
        // reproduzir jogo
        playGameSound(game)
        // atualizar cor da imagem
        updateBackgroundColor(game.color)
       // atualizar a cor do cabeçalho
        updateHeaderColor(game.color)
       // atualizar a imagem do jogo
        updatePicture(game)
      

        // Função para construit os modelos das letras
    
        var modelLetters = game.word.split( '' ); 
    
        for( var i in modelLetters ) { 
            var letter = modelLetters[ i ]; 
            $models.append( '<li>' + letter + '</li>' ); 
        }
    
        var letterWidth = $models.find( 'li' ).outerWidth( true ); 
    
        $models.width( letterWidth * $models.find( 'li' ).length );

//--------------------------------------------------------------------------------
        // Função para construir as letras embaralhadas

        var letters  = game.word.split( '' ), // separa cada letra do nome do animal
            shuffled = letters.sort( function() { return Math.random() < 0.5 ? -1 : 1 }); // o sort() é usado para ordenar elementos de um array
             Math.random()  //retorna um elemento número aleatorio de 0 a 1, como resultado ira embaralhar as letras do nome.

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

//----------------------------------------------------------------------------
        // Função para tornar as letras droppable (soltáveis)

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

     // Função para reproduzir o som do jogo
     function playGameSound(game){
        var gameSound = createSound( game.sound ); 
        return gameSound.play();
    }

    // Função para atualizar a cor de fundo
    function updateBackgroundColor(color){
        $body.stop().animate({
            backgroundColor: color 
        }, 1000);  
    }

    // Função para atualizar a cor do cabeçalho
    function updateHeaderColor(color) {
    $header.stop().animate({ 
        color: color 
    }, 1000);
}

    // função para atualizar a imagem do jogo
    function updatePicture(game){
    $picture.attr( 'src', game.img ) 
    .unbind( 'click' ) 
    .bind( 'click', function() { 
        playGameSound(game); 
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