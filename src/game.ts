import 'phaser';

export default class Demo extends Phaser.Scene
{
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    score: integer;
    scoreText: Phaser.GameObjects.Text;
    bombs: Phaser.Physics.Arcade.Group;
    gameOver: boolean;
    maxScore: number;
    starValue: number;
    numberStars: number;
    constructor ()
    {
        super('demo');
        this.score = 0;
        this.starValue = 10;
        this.numberStars = 10;
        this.maxScore = this.numberStars * this.starValue;
    }

    
    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.spritesheet('dude',
            'assets/dude.png',
            {frameWidth: 32, frameHeight: 48}
        );
    }

    //set up ground platforms using physics static group: can't move around
    addPlatforms()
    {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground')
            .setScale(2)
            .refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(740,220, 'ground');
        this.platforms;
    }

    //load player animations and which frames to use
    addPlayerAnimations()
    {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ {key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }

    collectStar(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, star)
    {
        star.disableBody(true,true)
        this.score += this.starValue;
        this.scoreText.setText('Score: ' + this.score);

        //add bomb so level gets harder each star you collect
        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    hitBomb(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, hitBomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }

    create ()
    {
        this.add.image(400,300,'sky');

        this.addPlatforms();

        //add player sprite with collison
        this.player = this.physics.add.sprite(100,450,'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        this.addPlayerAnimations();

        let stars = this.physics.add.group({
            key: 'star',
            repeat: this.numberStars -1,
            setXY: {x: 12, y: 0, stepX: 70}
        });
        
        /*
        stars.children.iterate(function (child) {
            //Not working, ts complains it doesn't exist on game object
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        */

        this.physics.add.collider(stars,this.platforms);

        this.physics.add.overlap(this.player, stars, this.collectStar, null, this);

        this.scoreText = this.add.text(16,16,'score: 0', {fontSize: '32px'})

        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }
    
    update() {
        let cursors = this.input.keyboard.createCursorKeys();
        
        //stop game if over, TODO: add nice retry button or something instead
        if (this.gameOver) 
        {
            this.add.text(100,100,'Game Over', {fontSize: '64px'})
            return;
        }

        if (this.score === this.maxScore)
        {
            this.player.setVelocityX(0);
            this.add.text(100,100,'You Win', {fontSize: '64px'})
            return;
        }
        
        if (cursors.left.isDown) 
        {
            this.player.setVelocityX(-160);
            this.player.anims.play('left',true);
        }
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else 
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Demo,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    }
};

const game = new Phaser.Game(config);


