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