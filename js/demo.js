// Configurações padrão para a biblioteca Buzz.js
buzz.defaults.formats = ['ogg', 'mp3']; 
buzz.defaults.preload = 'metadata'; 


// // Função para criar instâncias de som 
// todo: alterado para ser reutilizavel
// function createSound(src) {
//     return new buzz.sound(src); 
// }

// todo: Bella
// Função para criar instâncias de som com verificação de erro***
function createSound(src, onError = () => console.warn(`Failed to load sound: ${src}`)) {
    const sound = new buzz.sound(src, {
        formats: ['mp3', 'ogg'], // Especificar os formatos esperados
        preload: true, // Pré-carregar os arquivos para reprodução mais rápida
        autoload: true, // Carregar automaticamente
        error: onError  // Tratamento de erro personalizado
    });
    return sound;
}

// Sons associados a cada letra do alfabeto
const alphabetSounds = {};

// Letras do alfabeto
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// //  Associar sons a cada letra do alfabeto
// alphabet.forEach(letter => {
//     alphabetSounds[letter] = createSound(`sounds/kid/${letter}`);
// });

// todo: Bella
// Associar sons a cada letra do alfabeto*** 
alphabet.forEach(letter => {
    const soundPath = `sounds/kid/${letter}`;
    // Verificação opcional de existência do arquivo antes de criar o som pode ser adicionada aqui
    alphabetSounds[letter] = createSound(soundPath);
});

// todo: Bella
// Usando o objeto alphabetSounds de forma assíncrona após carregamento***
function playSoundByLetter(letter) {
    if (alphabetSounds[letter]) {
        alphabetSounds[letter].play().catch(error => {
            console.error("Error playing the sound:", error);
        });
    } else {
        console.log("No sound associated with this letter.");
    }
}


// todo: Bella
// Função para criar instâncias de som com verificação de disponibilidade e erro***
function createSound(src, callback) {
    if (!buzz.isSupported()) {
        console.error("Buzz library is not supported in this browser.");
        return null;  // Retorna null se o Buzz não for suportado
    }

    const sound = new buzz.sound(src, {
        formats: ['mp3', 'ogg'],
        preload: true,
        autoload: true,
        error: function () {
            console.error("Failed to load sound:", src);
            callback && callback(new Error("Failed to load sound"));
        }
    });
    return sound;
}

// // Instâncias de som para vitória e erro
// const winSound = createSound('sounds/win');
// const errorSound = createSound('sounds/error');

// todo: Bella
// Instâncias de som para vitória e erro com callbacks para tratar erros***
const winSound = createSound('sounds/win', (error) => {
    if (error) {
        $('#warning').text('Failed to load win sound').show();
    }
});
const errorSound = createSound('sounds/error', (error) => {
    if (error) {
        $('#warning').text('Failed to load error sound').show();
    }
});


$(function() {
    // // Verifica se a biblioteca 'Buzz' é suportada pelo navegador
    // if (!buzz.isSupported()) {
    //     $('#warning').show(); // Exibe o elemento com id='warning'
    // }

    // todo: Bella
    // Exibe um aviso se a biblioteca Buzz não é suportada, independente de tentar carregar sons***
    if (!buzz.isSupported()) {
        $('#warning').text('Buzz library is not supported in this browser.').show();
    }

    // idx ainda precisa ser definido para o restante do código
    var idx = 0,
        // Seleciona os elementos HTML e armazena-os em variáveis
        //todo: Alterado - incluir tudo em variaveis
        $container  = $( '#container' ), 
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' ),
        $body       = $( 'body' ),
        $next       = $( '#next' ),
        $previous    = $( '#previous' ),
        $level      = $('#level')
        $header     = $('#header')


    //* Impede a seleção de texto no corpo do documento
    $body.on('selectstart', function() {
        return false;
    });

    //* Atualiza o jogo e avança para o próximo índice
    $next.click(function() {
        refreshGame()
        buildGame(++idx);
        return false; // bloqueia a ação padrão do link
    });

    //* Atualiza o jogo e retrocede para o índice anterior
    $previous.click( function() {
       refreshGame();
       buildGame( --idx ); 
       return false;
    });

    //* Alterna entre os níveis de dificuldade
    $level.click(function() {
        var $this = $(this);
        var newText = $this.text() === 'easy' ? 'hard' : 'easy';
        $this.text(newText);
        $models.toggleClass('hard');
        return false;
    });

    //* limpa toda as alterações da página anterior
    function refreshGame() {
        $models.html( '' ); 
        $letters.html( '' );
    }

    //! Construção do jogo
    function buildGame( x ) {

        if ( x > games.length - 1 ) { 
            idx = 0; 
        }
        if ( x < 0 ) {
            idx = games.length - 1; 
        }

        var game  = games[ idx ],
            score = 0; 

     var modelLetters = game.word.split( '' );
       
      //todo: Alterado - Dividir as responsabilidades em funções menores.
        // reproduzir jogo
        playGameSound(game)
        // atualizar cor da imagem
        updateBackgroundColor(game.color)
        // atualizar a cor do cabeçalho
        updateHeaderColor(game.color)
        // atualizar a imagem do jogo
        updatePicture(game)
        // construir os modelos das letras
        BuildTemplateLettering(game.word)
        // construir as letras embaralhadas
        BuildScrambledLetters(modelLetters)
        // tornar as letras droppable(soltáveis)
        BuildDropdownLetters(score, modelLetters)
              
}

//-----------------------------------------------------------------------------------

     //todo: Alterado - Função com responsabilidade especifica
     //! Função para reproduzir o som do jogo
     function playGameSound(game){
        var gameSound = createSound( game.sound ); 
        return gameSound.play();
    }

    //todo: Alterado - Função com responsabilidade especifica
    //! Função para atualizar a cor de fundo
    function updateBackgroundColor(color){
        $body.stop().animate({
            backgroundColor: color 
        }, 1000);  
    }

    //todo: Alterado - Função com responsabilidade especifica
    //! Função para atualizar a cor do cabeçalho
    function updateHeaderColor(color) {
        $header.stop().animate({ 
        color: color 
    }, 1000);
}

    //todo: Alterado - Função com responsabilidade especifica
    //! Função para atualizar a imagem do jogo
    function updatePicture(game){
        $picture.attr( 'src', game.img ) 
        .unbind( 'click' ) 
        .bind( 'click', function() { 
        playGameSound(game); 
    });
}

    //todo: Alterado - Função com responsabilidade especifica
    //! Função para construir os modelos das letras
    function BuildTemplateLettering(game){
        var modelLetters = game.split( '' ); 
    
        for( var i in modelLetters ) { 
            var letter = modelLetters[ i ]; 
            $models.append( '<li>' + letter + '</li>' ); 
        }
    
        var letterWidth = $models.find( 'li' ).outerWidth( true ); 
    
        $models.width( letterWidth * $models.find( 'li' ).length );
    }


    //todo: Alterado - Função com responsabilidade especifica
     //! Função para construir as letras embaralhadas
     function BuildScrambledLetters(modelLetters){
        var letterWidth = $models.find( 'li' ).outerWidth( true );

        var shuffled = modelLetters.sort( function() { return Math.random() < 0.5 ? -1 : 1 }); 
        Math.random();  

        for( var i in shuffled ) {
            $letters.append( '<li class="draggable">' + shuffled[ i ] + '</li>' ); 
        };

        $letters.find( 'li' ).each( function( i ) { 
         // retorna a posição do primeiro elemento e indicada uma posição aleatoria 
        var top   = ( $models.position().top ) + ( Math.random() * 100 ) + 80,  
            left  = ( $models.offset(). left - $container.offset().left ) + ( Math.random() * 20 ) + ( i * letterWidth ),
            angle = ( Math.random() * 30 ) - 10; 

        $( this ).css({
            top:  top  + 'px',
            left: left + 'px'
        });

        rotate( this, angle );

        // evento de clicar no mouse 
        $( this ).mousedown( function() {
            var letter = $( this ).text(); 
            if ( alphabetSounds[ letter ] )
                alphabetSounds[ letter ].play(); 

        });
    });
}

//------------------------------------------------------------------------

    //todo: Alterado - Função com responsabilidade especifica
    //! Função para tornar as letras droppable (soltáveis)
    function BuildDropdownLetters(score, modelLetters){
        // seleciona todos os elementos 'li.draggable' os torna arrastaveis.
        $letters.find( 'li.draggable' ).draggable({ 
            // garante que os elementos fiquem acima dos outros 
            zIndex: 9999, 
            stack: '#letters li' 
        });
        
        // 0 elemento se torna uma área onde outros elementos podem ser soltos
        $models.find( 'li' ).droppable( { 
            // especifica a classe CSS
            accept: '.draggable', 
            hoverClass: 'hover', 
            // é executada quando o elemento arrastavel é solto
            drop: function( e, ui ) {
                var modelLetter   = $( this ).text(), // área do elemento solto
                    droppedLetter = ui.helper.text(); // elemento solto

        if ( modelLetter == droppedLetter ) { 
            // anima o elemento arrastavel
            ui.draggable.animate( { 
                // elemento solto fica na mesma posição da área
                top:     $( this ).position().top,
                left:     $( this ).position().left 
                // remove e desabilidade a funcionalidade de arrastar o elemento
            } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true ).css({  
                //todo: INCLUIDO - Em caso de acerto a letra fica 'Verde'
                boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.7)', 
                textShadow: '4px 4px 8px rgba(255,255,255,0.7)',
                background: 'hsl(120, 100%, 50%)', 
            }); 
            
            rotate( ui.draggable, 0 );
            
            score++;
            
            // se completar as letras, ele vence o jogo
            if ( score == modelLetters.length ) {
                winGame(); 
            }    
        } else {

            //todo: INCLUIDO - Em caso de erro a letra fica 'Vermelha'
            ui.draggable.css({
                background:'red'

        })
            // a letra volta para sua posição inical após ser solto
            ui.draggable.draggable( 'option', 'revert', true ); 

            errorSound.play();

            setTimeout( function() {
                // desativado o recuo para a posição inicial e permanecer onde foi solto
                ui.draggable.draggable( 'option', 'revert', false );
            }, 100 );
        }
    }
});
}

// --------------------------------------------------------------------------------


    //! Quando o jogador ganhar o jogo
    function winGame() { 

        winSound.play(); 

           // seleciona todos os elementos li e executa uma função para cada elemento
        $( '#letters li' ).each( function( i ) 
        {   // cria uma variavel que armazena uma referencia ao elemento 'li' atual
            var $$ = $( this ); 
            setTimeout( function() {
                $$.animate({
                    // cada letra se move para baixo
                    top:'+=60px' 
                });
            // cada item vai se move com atraso em relação ao anterior
            }, i * 300 ); 
        });

        // atualiza ou reinicia o jogo
        setTimeout( function() {
            refreshGame(); 
            // construir e preparar o proximo jogo
            buildGame( ++idx ); 
        }, 3000);
    }

//todo: INCLUIDO - Botão de 'Reset'
//! Vinculando o botão de reinício ao evento de clique
$('#reset').click(function() {
    refreshGame(); // Limpa as alterações da página
    buildGame(idx); // Reconstrói o jogo atual
    return false; // Impede a ação padrão do link
});

    //! o html a ser rotacionado('el') e o angulo da rotação('angle)
    function rotate( el, angle ) { 

        $( el ).css({ 
            // tipos dos navegadores que poderão ser suportados
            '-webkit-transform': 'rotate(' + angle + 'deg)', 
            '-moz-transform': 'rotate(' + angle + 'deg)', 
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    //! construir novo jogo de acordo com esse 'idx'
    buildGame( idx ); 
});