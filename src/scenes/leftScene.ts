import BaseScene from "./baseScene";

export default class LeftScene extends BaseScene {
    constructor() {
        super("LeftScene");
        this.startPlayerX = 750;
        this.startPlayerY = 500;
    }

    create() {
        super.create();
        this.createPlatforms([
            [600, 250],
            [50, 400],
        ]);
        this.createSceneTitle("Left Scene");
    }

    update() {
        super.update();
        const playerX = this.getPlayerX();
        if (playerX === undefined) {
            return;
        }
        if (playerX > 800 - 17) {
            this.scene.start("MainScene");
            return;
        }
    }
}
