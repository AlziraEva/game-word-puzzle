// ----------------------------------------------------------------------------
// Buzz, a Javascript HTML5 Audio library 
// v 1.0.x beta
// Licensed under the MIT license.
// // ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// // ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files ( the "Software" ), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------

var buzz = { // objeto
    defaults: { 
        autoplay: false, // indica  se o audio precisa começar automaticamente após inicado
        duration: 5000, // duração padrão para o audio
        formats: [], // formato de audio, nenhum foi definido inicalmente
        loop: false, // indica se o audio deve inicar automaticamente ao iniciar
        placeholder: '--', // marcador de posição, que é indicado caso o audio não possa ser reproduzido ou carregado
        preload: 'metadata', // indica como o audio deve ser carregado inicialmente. 'metadada' significa que apenas as informações de metadados do áudio serão carregadas.
        volume: 80 // volume do audio
    },
    types: { // mapeia as extenções de arquivos de audio para seus tipos MIME correspondentes
        'mp3': 'audio/mpeg',
        'ogg': 'audio/ogg',
        'wav': 'audio/wav',
        'aac': 'audio/aac',
        'm4a': 'audio/x-m4a'
    },
    sounds: [], // serve para armazenar uma lista de audios que seram usadas posteriormente
    el: document.createElement( 'audio' ), // uma tag <audio> é criada no index.html, sendo atribuida a propriedade el: 
    
    sound: function( src, options ) { // 'src' representa a fonte do audio e 'options' objeto contem as opções deconfigurações 
        var options = options || {}, // define as 'options' ou usa um objeto vazio se não tiver 'options'
            pid = 0, // armazena o id do som
            events = [], // armazena eventos
            eventsOnce = {}, // armazena eventos que só acontecem uma vez
            supported = buzz.isSupported(); // verifica se a biblioteca Buzz é suportada no ambiente

        // publics
        this.load = function() { // está sendo criada uma função chamada 'load()' vinculada ao objeto atual
            if ( !supported ) return this; // verifica se a biblioteca Buzz é suportada

            this.sound.load(); // carrega o som usando o método load()
            return this;
        }
        
        this.play = function() { // está sendo criada uma função chamada 'play()' vinculada ao objeto atual
            if ( !supported ) return this;

            this.sound.play(); // reproduz o som
            return this;
        }
        
        this.togglePlay = function() { // está sendo criada uma função chamada 'togglePlay()' vinculada ao objeto atual, é usada para alternar entre reproduzir e pousar o som
            if ( !supported ) return this;
            
            if ( this.sound.paused ) { // se o som estiver pausado 
                this.sound.play(); // ira reproduzir
            } else { // se estiver reproduzindo
                this.sound.pause(); // ira pausar
            }
            return this;
        }
        
        this.pause = function() {
            if ( !supported ) return this;

            this.sound.pause(); // pausa o som
            return this;
        }
        
        this.isPaused = function() {
            if ( !supported ) return null;

            return this.sound.paused; // retorna o estado de pausa do som, true (som pausado) ou false (som reproduzindo)
        }
        
        this.stop = function() {
            if ( !supported  ) return this;
            
            this.setTime( this.getDuration() ); // define o tempo de reprodução para o fim da duração do audio, movendo o cursor de reprodução para o fim da faixa
            this.sound.pause(); // pausa a reprodução do som
            return this;
        }
        
        this.isEnded = function() {
            if ( !supported ) return null;

            return this.sound.ended; // retorna o estado de finalização do som, true (se o som tiver sido reproduzido até o final) ou false (caso contrário)
        }
        
        this.loop = function() {
            if ( !supported ) return this;
            
            this.sound.loop = 'loop'; // faz com que o audio seja repetido continuamente
            this.bind( 'ended.buzzloop', // associa um evento de escuta ao objeto, é acionado quando o som termina de ser reproduzido
            function() {  
                this.currentTime = 0; // redefine o tempo de reprodução para o inicio
                this.play(); // reproduz novamente o som
            });
            return this;
        }
        
        this.unloop = function() {
            if ( !supported ) return this;
            
            this.sound.removeAttribute( 'loop' ); // impede que o audio seja reproduzido em loop
            this.unbind( 'ended.buzzloop' ); // remove o evento de escuta ao termino da música
            return this;
        }
        
        this.mute = function() {
            if ( !supported ) return this;
            
            this.sound.muted = true; // o som não será reproduzido, ainda que possa se carregado
            return this;
        }
        
        this.unmute = function() {
            if ( !supported ) return this;
            
            this.sound.muted = false; // desativa o modo muda, permitindo que o som seja reproduzido
            return this;
        }
        
        this.toggleMute = function() {
            if ( !supported ) return this;

            this.sound.muted = !this.sound.muted; // altera o estado mudo do som, e estiver ativado(desativa), e se estiver desativado(ativa)
            return this;
        }
        
        this.isMuted = function() {
            if ( !supported ) return null;

            return this.sound.muted; // estado de mudo do som, se mudo (true), caso contrario false
        }
        
        this.setVolume = function( volume ) {
            if ( !supported ) return this;

            if ( volume < 0 ) volume = 0;
            if ( volume > 100 ) volume = 100;
            this.volume = volume; // passa o valor do parametro volume é associado ao valor do volume do objeto
            this.sound.volume = volume / 100; // valor do voluma é passado para o objeto volume do 'sound' e convertido para a escala 0 a 1
            return this;
        },
        this.getVolume = function() {
            if ( !supported ) return this;

            return this.volume; // retorna o valor do volume
        }
        
        this.increaseVolume = function( value ) { // aumenta o volume do som, se nenhum valor for passado será '1' por padrão
            return this.setVolume( this.volume + ( value || 1 ) ); // chama o metodo setVolume() passa o argumento this.volume e incrementa  o value, caso não tenha nenhum valor no value, será '1'.
        }
        
        this.decreaseVolume = function( value ) { // diminui o volume do som
            return this.setVolume( this.volume - ( value || 1 ) ); // decrementa -value ou -1 como argumento do metodo setValue()
        }
        
        this.setTime = function( time ) {
            if ( !supported ) return this;
            
            this.whenReady( function() { // aguarda até que o som esteja pronto para ser manipulado abtes de executar o código que está dentro dele
                this.sound.currentTime = time; // define o tempo de reprodução do som de acordo com o 'time'
            });
            return this;
        }
        
        this.getTime = function() {
            if ( !supported ) return null;

            var time = Math.round( this.sound.currentTime * 100 ) / 100; // calcula o tempo atual de reprodução do som associado
            return isNaN( time ) ? buzz.defaults.placeholder : time; // é verificado se o tempo calculado é um número válido
        }
        
        this.setPercent = function( percent ) {
            if ( !supported ) return this;

            return this.setTime( buzz.fromPercent( percent, this.sound.duration ) );
        }
        
        this.getPercent = function() {
            if ( !supported ) return null;

			var percent = Math.round( buzz.toPercent( this.sound.currentTime, this.sound.duration ) );
            return isNaN( percent ) ? buzz.defaults.placeholder : percent;
        }
        
        this.setSpeed = function( duration ) {
			if ( !supported ) return this;
			
            this.sound.playbackRate = duration;
        }
        
        this.getSpeed = function() {
			if ( !supported ) return null;
			
            return this.sound.playbackRate;
        }
        
        this.getDuration = function() {
            if ( !supported ) return null;

            var duration = Math.round( this.sound.duration * 100 ) / 100;
            return isNaN( duration ) ? buzz.defaults.placeholder : duration;
        }
        
        this.getPlayed = function() {
			if ( !supported ) return null;
			
            return timerangeToArray( this.sound.played );
        }
        
        this.getBuffered = function() {
			if ( !supported ) return null;
			
            return timerangeToArray( this.sound.buffered );
        }
        
        this.getSeekable = function() {
			if ( !supported ) return null;
			
            return timerangeToArray( this.sound.seekable );
        }
        
        this.getErrorCode = function() {
            if ( supported && this.sound.error ) {
                return this.sound.error.code;
            }
            return 0;
        }
        
        this.getErrorMessage = function() {
			if ( !supported ) return null;
			
            switch( this.getErrorCode() ) {
                case 1: 
                    return 'MEDIA_ERR_ABORTED';
                case 2:
                    return 'MEDIA_ERR_NETWORK';
                case 3:
                    return 'MEDIA_ERR_DECODE';
                case 4: 
                    return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
                default:
                    return null;
            }
        }
        
        this.getStateCode = function() {
			if ( !supported ) return null;
			
            return this.sound.readyState;
        }
        
        this.getStateMessage = function() {
			if ( !supported ) return null;
			
            switch( this.getStateCode() ) {
                case 0: 
                    return 'HAVE_NOTHING';
                case 1:
                    return 'HAVE_METADATA';
                case 2:
                    return 'HAVE_CURRENT_DATA';
                case 3: 
                    return 'HAVE_FUTURE_DATA';
                case 4: 
                    return 'HAVE_ENOUGH_DATA';
                default:
                    return null;
            }
        }
        
        this.getNetworkStateCode = function() {
			if ( !supported ) return null;
			
            return this.sound.networkState;
        }
        
        this.getNetworkStateMessage = function() {
			if ( !supported ) return null;
			
            switch( this.getNetworkStateCode() ) {
                case 0: 
                    return 'NETWORK_EMPTY';
                case 1:
                    return 'NETWORK_IDLE';
                case 2:
                    return 'NETWORK_LOADING';
                case 3: 
                    return 'NETWORK_NO_SOURCE';
                default:
                    return null;
            }
        }
        
        this.set = function( key, value ) {
            if ( !supported ) return this;

            this.sound[ key ] = value; // permite que chame vários metodos consecutivos no objeto 
            return this;
        }
        
        this.get = function( key ) {
            if ( !supported ) return null;

            return key ? this.sound[ key ] : this.sound; // verifica se foi possada uma chave key, se sim é acessado esse valor no objeto
        }
        
        this.bind = function( types, func ) {
            if ( !supported ) return this;

            var that = this,
                types = types.split( ' ' ), // divide os tipos de eventos fornecidos em uma string e armazenando em um array
				efunc = function( e ) { func.call( that, e ) };
            
            for( var t in types ) {
                var type = types[ t ],
                    idx = type;                
				    type = idx.split( '.' )[ 0 ];

                    events.push( { idx: idx, func: efunc } );
                    this.sound.addEventListener( type, efunc, true );
            }
            return this;
        }
        
        this.unbind = function( types ) {
            if ( !supported ) return this;

            var types = types.split( ' ' );
                        
            for( var t in types ) {
                var idx = types[ t ];
				    type = idx.split( '.' )[ 0 ];

                for( var i in events ) {
                    var namespace = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( namespace[ 1 ] && namespace[ 1 ] == idx.replace( '.', '' ) ) ) {
				        this.sound.removeEventListener( type, events[ i ].func, true );
                        delete events[ i ];
                    }
                }
            }
            return this;
        }
        
        this.bindOnce = function( type, func ) {
            if ( !supported ) return this;
            
            var that = this;
            
            eventsOnce[ pid++ ] = false;
            this.bind( pid + type, function() {
               if ( !eventsOnce[ pid ] ) {
                   eventsOnce[ pid ] = true;
                   func.call( that );                   
               }
               that.unbind( pid + type );
            });
        }
        
        this.trigger = function( types ) {
            if ( !supported ) return this;
        
            var types = types.split( ' ' );
                        
            for( var t in types ) {
                var idx = types[ t ];
        
                for( var i in events ) {
                    var eventType = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( eventType[ 0 ] && eventType[ 0 ] == idx.replace( '.', '' ) ) ) {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent( eventType[ 0 ], false, true );
                        this.sound.dispatchEvent( evt );
                    }   
                }
            }
            return this;
        }
        
        this.fadeTo = function( to, duration, callback ) {
			if ( !supported ) return this;
			 
            if ( duration instanceof Function ) {
                callback = duration;
                duration = buzz.defaults.duration;
            } else {
                duration = duration || buzz.defaults.duration;
            }

            var from = this.volume,
				delay = duration / Math.abs( from - to ),
                that = this;
            this.play();
            
            function doFade() {
                setTimeout( function() {
                    if ( from < to && that.volume < to ) {
                        that.setVolume( that.volume += 1 );
                        doFade();
                    } else if ( from > to && that.volume > to ) {
                        that.setVolume( that.volume -= 1 );
                        doFade();                        
                    } else if ( callback instanceof Function ) {
                        callback.apply( that );
                    }
                }, delay );
            }
            this.whenReady( function() {
                doFade();       
            });
			
			return this;
        }
        
        this.fadeIn = function( duration, callback ) {
			if ( !supported ) return this;
			 
            return this.setVolume(0).fadeTo( 100, duration, callback );
        }
        
        this.fadeOut = function( duration, callback ) {
			if ( !supported ) return this;
			 
            return this.fadeTo( 0, duration, callback );
        }
        
        this.fadeWith = function( sound, duration ) {
			if ( !supported ) return this;
			 
            this.fadeOut( duration, function() {
                this.stop();
            });

            sound.play().fadeIn( duration );

			return this;
        }
        
        this.whenReady = function( func ) {
            if ( !supported ) return null;
            
            var that = this;
            if ( this.sound.readyState == 0 ) {
                this.bind( 'canplay.buzzwhenready', function() {
                    func.call( that );
                });
            } else {
                func.call( that );
            }
        }
        
        // privates
        function timerangeToArray( timeRange ) {
            var array = [],
                length = timeRange.length - 1;        
            
            for( var i = 0; i <= length; i++ ) {
                array.push({ 
                    start: timeRange.start( length ), 
                    end: timeRange.end( length )
                });
            }
            return array; 
        }

        function getExt( filename ) {
            return filename.split('.').pop();
        }
        
        function addSource( sound, src ) { // cria uma tag de audio no html
            var source = document.createElement( 'source' );
            source.src = src;
            if ( buzz.types[ getExt( src ) ] ) {
                source.type = buzz.types[ getExt( src ) ];
            }
            sound.appendChild( source );
        }
        
        // init
        if ( supported ) {
            for( var i in buzz.defaults ) {
                options[ i ] = options[ i ] || buzz.defaults[ i ];
            }

            this.sound = document.createElement( 'audio' );
            
            if ( src instanceof Array ) {
                for( var i in src ) {
                    addSource( this.sound, src[ i ] );
                }
            } else if ( options.formats.length ) {
                for( var i in options.formats ) {
                    addSource( this.sound, src + '.' + options.formats[ i ] );
                }
            } else {
                addSource( this.sound, src );
            }
            
            if ( options.loop ) {
                this.loop();
            }
            
            if ( options.autoplay ) {
                this.sound.autoplay = 'autoplay';
            }
            
            if ( options.preload === true ) {
                this.sound.preload = 'auto';
            } else if ( options.preload === false ) {                
                this.sound.preload = 'none';
            } else {
                this.sound.preload = options.preload;
            }
            
            this.setVolume( options.volume );
            
            buzz.sounds.push( this );
        }
    },
    
    group: function( sounds ) {
        var sounds = argsToArray( sounds, arguments );

        // publics
        this.getSounds = function() {
            return sounds;
        }
        
        this.add = function( soundArray ) {
            var soundArray = argsToArray( soundArray, arguments );
            for( var a in soundArray ) {
                for( var i in sounds ) {
                    sounds.push( soundArray[ a ] );
                }
            }
        }
        
        this.remove = function( soundArray ) {
            var soundArray = argsToArray( soundArray, arguments );
            for( var a in soundArray ) {
                for( var i in sounds ) {
                    if ( sounds[ i ] == soundArray[ a ] ) {
                        delete sounds[ i ];
                        break;
                    }
                }
            }
        }
        
        this.load = function() {
            fn( 'load' );
            return this;
        }
        
        this.play = function() {
            fn( 'play' );
            return this;
        }
        
        this.togglePlay = function( ) {
            fn( 'togglePlay' );
            return this;
        }
        
        this.pause = function( time ) {
            fn( 'pause', time );
            return this;
        }
        
        this.stop = function() {
            fn( 'stop' );
            return this;
        }
        
        this.mute = function() {
            fn( 'mute' );
            return this;
        }
        
        this.unmute = function() {
            fn( 'unmute' );
            return this;
        }
        
        this.toggleMute = function() {
            fn( 'toggleMute' );
            return this;
        }
        
        this.setVolume = function( volume ) {
            fn( 'setVolume', volume );
            return this;
        }
        
        this.increaseVolume = function( value ) {
            fn( 'increaseVolume', value );
            return this;
        }
        
        this.decreaseVolume = function( value ) {
            fn( 'decreaseVolume', value );
            return this;
        }
        
        this.loop = function() {
            fn( 'loop' );
            return this;
        }
        
        this.unloop = function() {
            fn( 'unloop' );
            return this;
        }
        
        this.setTime = function( time ) {
            fn( 'setTime', time );
            return this;
        }
        
        this.setduration = function( duration ) {
            fn( 'setduration', duration );
            return this;
        }
        
        this.set = function( key, value ) {
            fn( 'set', key, value );
            return this;
        }
        
        this.bind = function( type, func ) {
            fn( 'bind', type, func );
            return this;
        }
        
        this.unbind = function( type ) {
            fn( 'unbind', type );
            return this;
        }
        
        this.bindOnce = function( type, func ) {
            fn( 'bindOnce', type, func );
            return this;
        }
        
        this.trigger = function( type ) {
            fn( 'trigger', type );
            return this;
        }
        
        this.fade = function( from, to, duration, callback ) {
            fn( 'fade', from, to, duration, callback );
            return this;
        }
        
        this.fadeIn = function( duration, callback ) {
            fn( 'fadeIn', duration, callback );
            return this;
        }
        
        this.fadeOut = function( duration, callback ) {
            fn( 'fadeOut', duration, callback );
            return this;
        }
        
        // privates
        function fn() {
            var args = argsToArray( null, arguments ),
                func = args.shift();
                
            for( var i in sounds ) {
                sounds[ i ][ func ].apply( sounds[ i ], args );
            }
        }
        
        function argsToArray( array, args ) {
            return ( array instanceof Array ) ? array : Array.prototype.slice.call( args );
        }
    },
    
    all: function() {
      return new buzz.group( buzz.sounds );
    },

    isSupported: function() {
        return !!this.el.canPlayType;
    },
    
    isOGGSupported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/ogg; codecs="vorbis"' );
    },
    
    isWAVSupported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/wav; codecs="1"' );
    },
    
    isMP3Supported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/mpeg;' );
    },
    
    isAACSupported: function() {
        return !!this.el.canPlayType && ( this.el.canPlayType( 'audio/x-m4a;' ) || this.el.canPlayType( 'audio/aac;' ) );
    },
    
    toTimer: function( time, withHours ) {
        h = Math.floor( time / 3600 );
        h = isNaN( h ) ? '--' : ( h >= 10 ) ? h : '0' + h;            
        m = withHours ? Math.floor( time / 60 % 60 ) : Math.floor( time / 60 );
        m = isNaN( m ) ? '--' : ( m >= 10 ) ? m : '0' + m;
        s = Math.floor( time % 60 );
        s = isNaN( s ) ? '--' : ( s >= 10 ) ? s : '0' + s;
        return withHours ? h + ':' + m + ':' + s : m + ':' + s;
    },
    
    fromTimer: function( time ) {
        var splits = time.toString().split( ':' );
        if ( splits && splits.length == 3 ) {
            time = ( parseInt( splits[ 0 ] ) * 3600 ) + ( parseInt(splits[ 1 ] ) * 60 ) + parseInt( splits[ 2 ] );
        } 
        if ( splits && splits.length == 2 ) {
            time = ( parseInt( splits[ 0 ] ) * 60 ) + parseInt( splits[ 1 ] );
        }
        return time;
    },
    
    toPercent: function( value, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );

		return Math.round( ( ( value * 100 ) / total ) * r ) / r;
    },
    
    fromPercent: function( percent, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );
		
        return  Math.round( ( ( total / 100 ) * percent ) * r ) / r;
    }
}