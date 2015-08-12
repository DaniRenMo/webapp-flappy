var score = -3;
var labelScore;
var player;
var pipes = [];


var stateActions = { preload: preload, create: create, update: update };
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    event_details.preventDefault();
});

function preload() {

game.load.image("playerImg", "../assets/flappy_superman.png");
game.load.image("backgroundImg", "../assets/skyline.jpg");
    game.load.image("pipe", "../assets/pipe_green.png");

    game.load.audio("score", "../assets/point.ogg");
}

function create() {

    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 790;
    background.height = 400;

    game.add.text(100, 25, "Don't touch",
    {font: "30px Arial", fill: "#ffffff"});

    game.add.text(100, 53, "the kryptonite!",
        {font: "30px Arial", fill: "#ffffff"});


    labelScore = game.add.text(20, 20, "0",
        {font: "25px Arial", fill: "#ffffff"});

    player = game.add.sprite(100, 170, "playerImg");

    generatePipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(pipes);

    player.body.gravity.y = 300;

    var pipeInterval = 2.25;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
    generatePipe);

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

}


function addPipeBlock(x, y) {
    var block = game.add.sprite(x, y,"pipe");
    pipes.push(block);
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -130;
}

function generatePipe() {
    var gap = game.rnd.integerInRange(1, 5);
    for (var count=0; count<8; count++) {
        if (count != gap && count != gap +1) {
            addPipeBlock(800, count*50);
        }
    }
    changeScore();
}

function spaceHandler() {
    game.sound.play("score");
}

function changeScore() {
    score = score + 1;

    if(score>0){
        labelScore.setText(score.toString());
    }
}

function playerJump() {
    player.body.velocity.y = -180 ;
}

function update() {
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes,
            gameOver);
    }
}

function gameOver(score){
    game.destroy();
    alert("Ouchie...you died! Press F5 to Try again.");
    $("#score").val(score.toString());
        //location.reload();
}