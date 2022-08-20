var socket = io();

var mouseDown = false;
var brush;

//Chamando tela cheia
function fullScreen()
{
    
    var corpo = document.getElementById("body");

    //chamando tela cheia
    corpo.requestFullscreen()

    .then(function() {
		// element has entered fullscreen mode successfully

	})
	.catch(function(error) {
		// element could not enter fullscreen mode
	
    });
    
}

function startGame() {
    myGameArea.start();
}
    //Definindo a gamearea 
var myGameArea = {
    canvas: document.getElementById("canvas"),
    start: function()
    {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 100);
    },
    clear: function()
    {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}
    //Atualizando a gamearea
function updateGameArea() {
    //myGameArea.clear();
    //myGameObject.x += 1;
    //myGameObject.update();

    myGameArea.canvas.addEventListener("touchmove", desenhar);

    //Definindo chamando a função 'desenhar' baseado na movimentação do mouse quando o mouse está pressionado
    if(mouseDown == true){
        myGameArea.canvas.addEventListener("mousemove", desenhar);
    }

    //Retirando a chamada da função desenhar
    else{
        myGameArea.canvas.removeEventListener("mousemove", desenhar);
    }
    
}

    //Definindo o mouse como pressionado ou não 
addEventListener("mousedown", function(){mouseDown = true;},false);
addEventListener("mouseup", function(){mouseDown = false;},false);
function desenhar (move){
    
    //definindo borracha, cor e tamanho.
    var borracha = document.getElementById("borracha");
    var cor = document.getElementById("cor").value;
    var tamanho = document.getElementById("tamanho").value;

    //Decidindo se é touch ou mouse
    if(move.type == "touchmove")
    {
        console.log(move);
        var objDesenho = {
            x: move.touches[0].clientX,
            y: move.touches[0].clientY,
            cor: cor,
            tamanho: tamanho,
            borracha: borracha.checked
        }
    }
    else{
        var objDesenho = {
            x: move.offsetX,
            y: move.offsetY,
            cor: cor,
            tamanho: tamanho,
            borracha: borracha.checked
        }
    }

    console.log(objDesenho);
    socket.emit('desenhar', objDesenho);

    if(borracha.checked)
    {
        brush = new desenho(move.offsetX, move.offsetY, cor, tamanho)
        brush.apagar();
    }
    else
    {
        brush = new desenho(move.offsetX, move.offsetY, cor, tamanho);
        brush.update();
    }
    
}

socket.on('desenhos antigos', function(desenhos) {
    for(obj of desenhos)
    {
        if(obj.borracha)
        {
            brush = new desenho(obj.x, obj.y, obj.cor, obj.tamanho);
            brush.apagar();
        }
        else
        {
            brush = new desenho(obj.x, obj.y, obj.cor, obj.tamanho);
            brush.update();
        }
    }
});

socket.on('desenho', function(obj) {
    if(obj.borracha)
    {
        brush = new desenho(obj.x, obj.y, obj.cor, obj.tamanho);
        brush.apagar();
    }
    else
    {
        brush = new desenho(obj.x, obj.y, obj.cor, obj.tamanho);
        brush.update();
    }
});

function desenho(x, y, color, size) 
{
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.update = function()
    {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    },
    this.apagar = function(){
        ctx = myGameArea.context;
        ctx.clearRect(this.x, this.y, this.size, this.size);
    }
}
