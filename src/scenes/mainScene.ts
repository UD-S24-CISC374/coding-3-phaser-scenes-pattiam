import BaseScene from "./baseScene";

export default class MainScene extends BaseScene {
    constructor() {
        super("MainScene");
    }

    create() {
        super.create();
        this.createPlatforms([
            [600, 400],
            [50, 300],
            [700, 200],
        ]);
        this.createSceneTitle("Main Scene:");
        this.createInstructions("Go left, right, or up to explore");
    }

    update() {
        super.update();
        const playerX = this.getPlayerX();
        const playerY = this.getPlayerY();
        if (playerX === undefined || playerY === undefined) {
            return;
        }
        if (playerX < 17) {
            this.scene.start("LeftScene");
            return;
        }
        if (playerX > 800 - 17) {
            this.scene.start("RightScene");
            return;
        }
        if (playerY < 30) {
            this.scene.start("UpScene");
            return;
        }
    }
}
