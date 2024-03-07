import BaseScene from "./baseScene";

export default class UpScene extends BaseScene {
    constructor() {
        super("UpScene");
        this.startPlayerX = 400;
        this.startPlayerY = 300;
    }

    create() {
        super.create();
        this.createSceneTitle("Up Scene");
        this.createInstructions("Press down to go to the main scene");
    }

    update() {
        super.update();
        const playerX = this.getPlayerX();
        const playerY = this.getPlayerY();
        if (playerX === undefined) {
            return;
        }
        this.goDown();
    }
}
