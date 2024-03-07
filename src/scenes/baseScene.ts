import Phaser from "phaser";
export type Collidable =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Tilemaps.Tile;

export default class BaseScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars?: Phaser.Physics.Arcade.Group;

    private score = 0;
    private scoreText?: Phaser.GameObjects.Text;
    private titleText?: Phaser.GameObjects.Text;
    protected startPlayerX = 300;
    protected startPlayerY = 400;

    private bombs?: Phaser.Physics.Arcade.Group;

    private gameOver = false;

    constructor(key: string) {
        super({ key });
    }

    create() {
        this.add.image(400, 300, "sky");
        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms.create(
            400,
            568,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;
        this.createPlayer();
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.initializeScore();
        ground.setScale(2).refreshBody();
        this.createAnimations();
        if (this.player) {
            this.physics.add.collider(this.player, this.platforms);
            // Any other physics interactions involving this.player
        }
        this.createStars();
        this.createBombs();
    }

    protected createBombs() {
        this.bombs = this.physics.add.group();
        if (!this.platforms || !this.player) {
            return;
        }

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.handleHitBomb,
            undefined,
            this
        );
    }

    protected createStars() {
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        this.stars.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return true;
        });
        if (!this.platforms || !this.player) {
            return;
        }
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.handleCollectStar,
            undefined,
            this
        );
    }
    private handleCollectStar(player: Collidable, s: Collidable) {
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);

        this.updateScore(10);

        if (this.stars?.countActive(true) === 0) {
            this.stars.children.iterate((c) => {
                const child = c as Phaser.Physics.Arcade.Image;
                child.enableBody(true, child.x, 0, true, true);
                return true;
            });

            if (this.player) {
                const x =
                    this.player.x < 400
                        ? Phaser.Math.Between(400, 800)
                        : Phaser.Math.Between(0, 400);
                const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(
                    x,
                    16,
                    "bomb"
                );
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }
    }
    protected createPlayer() {
        this.player = this.physics.add.sprite(
            this.startPlayerX,
            this.startPlayerY,
            "dude"
        );
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNames("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }
    protected createAnimations() {
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNames("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }
    protected createPlatforms(platformCoords: [number, number][]) {
        for (const coords of platformCoords) {
            this.platforms?.create(coords[0], coords[1], "ground");
        }
    }
    protected updateScore(amount: number) {
        this.score += amount;
        this.registry.set("score", this.score); // Update score in registry
        this.scoreText?.setText(`Score: ${this.score}`);
    }
    protected initializeScore() {
        // Initialize or retrieve score from registry
        this.score = this.registry.get("score") || 0;
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: "32px",
            color: "#000",
        });
    }
    protected createSceneTitle(title: string) {
        this.titleText = this.add.text(400, 16, `${title}`, {
            fontSize: "32px",
            color: "#000",
        });
    }
    protected createInstructions(txt: string) {
        this.titleText = this.add.text(250, 50, `${txt}`, {
            fontSize: "20px",
            color: "#000",
        });
    }
    private handleHitBomb() {
        this.physics.pause();
        this.player?.setTint(0xff0000);
        this.player?.anims.play("turn");
        this.gameOver = true;
    }
    update() {
        this.playerMovement();
    }
    protected playerMovement() {
        if (!this.cursors || !this.player) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.anims.play("right", true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player?.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
    protected goDown() {
        if (!this.cursors || !this.player) {
            return;
        }
        if (this.cursors.down.isDown && this.player?.body?.touching.down) {
            this.scene.start("MainScene");
        }
    }
    protected getPlayerX() {
        return this.player?.x;
    }
    protected getPlayerY() {
        return this.player?.y;
    }
}
