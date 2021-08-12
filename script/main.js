class Cell {
    constructor(r, c, w, h) {
        this.row = r;
        this.col = c;

        this.width = w;
        this.height = h;
    }

    render(color) {
        noFill();
        stroke("grey");
        strokeWidth(1);

        let x = this.row * this.width,
            y = this.col * this.height,
            w = this.width,
            h = this.height;

        rect(x, y, w, h);
    }
}

class Snake {
    constructor(r, c, w, h) {
        this.cells = [new Cell(r, c, w, h)];

        let rand = Math.random();

        if(rand <= 0.25) {
            this.direction = "E";
        } else if(rand <= 0.5) {
            this.direction = "W";
        } else if(rand <= 0.75) {
            this.direction = "S";
        } else {
            this.direction = "N";
        }


        //this.direction = "E";
    }

    get head() {
        return this.cells[0];
    }

    get len() {
        return this.cells.length;
    }

    update() {
        if(keyIsDown(RIGHT_ARROW)) {
            this.direction = "E";
        } else if(keyIsDown(LEFT_ARROW)) {
            this.direction = "W";
        } else if(keyIsDown(UP_ARROW)) {
            this.direction = "N";
        } else if(keyIsDown(DOWN_ARROW)) {
            this.direction = "S";
        }
    }

    render() {
        this.renderBody();
        this.renderHead();
    }

    renderBody() {
        stroke("black");
        strokeWidth(1);

        for(let i = 1; i < this.cells.length; i++) {
            let c = this.cells[i];

            let x = c.col * c.width + c.width / 2,
                y = c.row * c.height + c.height / 2,
                r = c.width / 2;

            fill(`hsl(${(i * 10) % 360}, 100%, 50%)`);
            
            circle(x, y, r - 1);
            //rhombus(c.col * c.width, c.row * c.height, c.width, c.height);
            //rect(c.col * c.width, c.row * c.height, c.width, c.height);
        }
    }

    renderHead() {
        fill("grey");

        stroke("black");
        strokeWidth(1);

        let x = this.head.col * this.head.width,
            y = this.head.row * this.head.height,
            w = this.head.width,
            h = this.head.height;

        switch(this.direction) {
            case "E":
                triangle(x, y, x, y + h, x + w, y + h / 2);
                break;

            case "W":
                triangle(x, y + h / 2, x + w, y, x + w, y + h);
                break;

            case "N":
                triangle(x + w / 2, y, x, y + h, x + w, y + h);
                break;

            case "S":
                triangle(x, y, x + w, y, x + w / 2, y + h);
                break;
        }
    }

    crawl() {
        for(let i = this.cells.length - 1; i > 0; i--) {
            this.cells[i].row = this.cells[i - 1].row;
            this.cells[i].col = this.cells[i - 1].col;
        }

        this.advanceHead();
    }

    containsCell(row, col) {
        return this.cells.some(c => {
            return c.row === row && c.col === col;
        });
    }

    checkFoodCollision(food) {
        return this.head.row === food.row &&
                this.head.col === food.col;
    }

    grow() {
        let head = new Cell(this.head.row,
                            this.head.col,
                            this.head.width,
                            this.head.height);

        this.cells.unshift(head);
        this.advanceHead();
    }

    advanceHead() {
        switch(this.direction) {
            case "E":
                this.head.col++;
                break;

            case "W":
                this.head.col--;
                break;

            case "N":
                this.head.row--;
                break;

            case "S":
                this.head.row++;
                break;
        }
    }

    checkOutOfBounds(maxRow, maxCol) {
        return this.head.col < 0 || this.head.col > maxCol ||
                this.head.row < 0 || this.head.row > maxRow;
    }

    checkSelfCollision() {
        let {row, col} = this.head;
        return this.cells
                .slice(1)
                .some(c => {
                    return c.row === row && c.col == col;
                });
    }

    makeGulpSound() {
        let snd = new Audio("asset/snd/gulp.wav");
        snd.play();
    }
}

class Food {
    constructor(r, c, w, h) {
        this.row = r;
        this.col = c;

        this.width = w;
        this.height = h;

        this.delta = 0;
        this.increment = 1;
    }

    render() {
        stroke("black");
        strokeWidth(1);

        let x = this.col * this.width + this.delta,
            y = this.row * this.height + this.delta,
            w = this.width - 2 * this.delta,
            h = this.height - 2 * this.delta;

        fill(`hsl(175, 100%, ${50 + this.increment * 10}%)`);
        rect(x, y, w, h);
        this.delta += this.increment;

        if(this.delta < -1 || this.delta > 1) {
            this.increment = -this.increment;
        }
    }
}

class Game {
    constructor(w, h, cellw = 25, cellh = 25) {
        this.width = w;
        this.height = h;

        this.cellWidth = cellw;
        this.cellHeight = cellh;

        this.cols = Math.floor(this.width / this.cellWidth);
        this.rows = Math.floor(this.height / this.cellHeight);


        let x = Math.floor(this.rows / 2),
            y = Math.floor(this.cols / 2);

        //x = y = 1;

        this.snake = new Snake(x, y, this.cellWidth, this.cellHeight);
        this.food = this.prepFood();

        //this.food.row = Math.floor( this.rows / 2 );
        //this.food.col = Math.floor( this.cols / 2 );

        this.pixelsPerSecond = 250;
        this.clock = Date.now();
        this.status = "playing";

        canvas.width = width = this.width;
        canvas.height = height = this.height;

        this.score = 0;
        this.render();
    }

    prepFood() {
        let [r, c] = this.getRandomEmptyCell();
        return new Food(r, c, this.cellWidth, this.cellHeight);
    }

    getRandomEmptyCell() {
        while(true) {
            let r = Math.floor( Math.random() * this.rows ),
                c = Math.floor( Math.random() * this.cols );

            if(!this.snake.containsCell(r, c)) {
                return [r, c];
            }
        }
    }

    update() {
        if(this.status === "crashed") {
            if(keyIsDown(PLAY_AGAIN)) {
                game = new Game(width, height);
            }

            return;
        }

        this.snake.update();
        this.snake.crawl();

        if(this.snake.checkFoodCollision(this.food)) {
            this.onEatFood();
        }


        if(this.snake.checkOutOfBounds(this.rows - 1, this.cols - 1)) {
            this.status = "crashed";
        } else if(this.snake.checkSelfCollision()) {
            this.status = "crashed";
        }

        if(this.status == "crashed") {
            this.makeCrashSound();
        }
    }

    onEatFood() {
        this.updateScore();

        this.snake.makeGulpSound();
        this.snake.grow();
        this.food = this.prepFood();
    }

    updateScore() {
        let bonus = 50;

        // food on limit row/col is much harder to get
        if(this.food.row == 0 || this.food.row == this.rows - 1) {
            bonus *= 10;
        }

        if(this.food.col == 0 || this.food.col == this.cols - 1) {
            bonus *= 10;
        }

        // grant 10 points for each snake cell
        bonus += this.snake.len * 10;

        this.score += bonus;
    }

    makeCrashSound() {
        let hit = new Audio("asset/snd/hit.wav");

        hit.onended = () => {
            setTimeout(() => {
                let gameOver = new Audio("asset/snd/game_over.wav");
                gameOver.play();
            }, 150);
        }
        
        hit.play();
    }

    render() {
        if(this.status === "crashed") {
            this.drawCrashMessage();
            this.drawScore();
            return;
        }

        background("white");
        noFill();

        this.drawGrid();
        this.snake.render();
        this.food.render();

        this.drawScore();
    }

    drawGrid() {
        strokeWidth(0.5);
        stroke("#888888");

        let xMax = this.cols * this.cellWidth,
            yMax = this.rows * this.cellHeight;

        for(let c = 0; c <= this.cols; c++) {
            let x = c * this.cellWidth;
            line(x, 0, x, yMax);
        }

        for(let r = 0; r <= this.rows; r++) {
            let y = r * this.cellHeight;
            line(0, y, xMax, y);
        }

        strokeWidth(1);
        stroke("black");

        rect(1, 1, xMax - 2, yMax -2);
    }

    drawScore() {
        textSize(16);
        fill(this.status == "playing" ? "midnightblue" : "cyan");

        let x = this.cellWidth + 2,
            y = this.cellHeight - 2;

        text(`Snake length: ${this.snake.len}`, x, y);
        text(`Score: ${this.score}`, x, y + this.cellHeight);

        textSize(12);
    }

    drawCrashMessage() {
        background("black");

        textSize(16);
        fill("cyan");

        let x = this.width / 2 - 100,
            y = this.height / 2 - 30;

        text("You crashed!", x, y);
        text("Press [P] to play again.", x, y + 20);

        textSize(12);
    }
}


//let game = new Game(width, height);


function loop() {
    let clock = Date.now(),
        deltaTime = (clock - game.clock) / 1000,
        updateTime = game.cellWidth / game.pixelsPerSecond;


    if(game.status == "playing" && deltaTime < updateTime) {

        // take arrow key presses into consideration
        game.snake.update();

        return;
    }

    
    game.update();
    game.render();

    game.clock = clock;
}
