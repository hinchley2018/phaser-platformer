import 'phaser';

export default class Demo extends Phaser.Scene
{
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    constructor ()
    {
        super('demo');
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
        
    }
    update() {
        let cursors = this.input.keyboard.createCursorKeys();
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
