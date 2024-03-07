import BaseScene from "./baseScene";

export default class RightScene extends BaseScene {
    constructor() {
        super("RightScene");
        this.startPlayerX = 50;
        this.startPlayerY = 500;
    }

    create() {
        super.create();
        this.createPlatforms([
            [650, 450],
            [40, 250],
            [140, 350],
        ]);
        this.createSceneTitle("Right Scene");
    }

    update() {
        super.update();
        const playerX = this.getPlayerX();
        if (playerX === undefined) {
            return;
        }
        if (playerX < 17) {
            this.scene.start("MainScene");
            return;
        }
    }
}
