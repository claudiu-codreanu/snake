// ===========
// EASY CANVAS
// ===========

// This is an IIFE expression that will 'populate' the global space (e.g. window)
// with a few useful constants and functions to manipulate the canvas easily!

// Requirement: Use ONLY these global / public functions in your game!

(function(canvasId) {

    // --- Begin boiler plate and private code for canvas manipulation
    
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    const attributes = {
        fill : "black",
        stroke : "black",
        strokeWidth : 1,
        useFill : true,
        useStroke : true,
        textSize : 12
    }
    
    requestAnimationFrame(repeatOften);
    
    function repeatOften() {
        // If you define a function called `loop` in your progra
        // the engine will call it automatically
        if (window.loop)
            window.loop();

        requestAnimationFrame(repeatOften);
    }
    
    // --- Begin boiler plate and private code for keyboard manipulation
    
    const keyPressed = new Map();
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    
    function handleKeyDown(eventArgs) {
        if (!keyPressed.has(eventArgs.keyCode)) {
            keyPressed.set(eventArgs.keyCode, eventArgs.keyCode);
        }

        if(eventArgs.keyCode == UP_ARROW || eventArgs.keyCode == DOWN_ARROW ||
            eventArgs.keyCode == LEFT_ARROW || eventArgs.keyCode == RIGHT_ARROW) {
          if(eventArgs.preventDefault) {
            // need to discard these events, because they scroll the window down
            eventArgs.preventDefault();
          }
        }
    }
    
    function handleKeyUp(eventArgs) {
        if (keyPressed.has(eventArgs.keyCode)) {
            keyPressed.delete(eventArgs.keyCode);
        }
    }
    
    // --- Begin public functions (e.g. added to the global window object)
    // --- Feel free to use any of these global constants / functions in your program
    
    // Put a few constants in the global scope
    window.width = canvas.width;
    window.height = canvas.height;

    window.LEFT_ARROW = 37;
    window.RIGHT_ARROW = 39;

    window.UP_ARROW = 38;
    window.DOWN_ARROW = 40;

    window.PLAY_AGAIN = 80;
    
    
    // Clear the canvas with the specified color
    window.background = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Specify that the next shape won't be filled
    window.noFill = function() {
        attributes.useFill = false;
    }
    
    // Specify that the next shaped should be filled with specified color
    window.fill = function(color) {
        attributes.useFill = true;
        attributes.fill = color;
    }
    
    // Specify that the next shape should not have a stroke stroke
    window.noStroke = function() {
        attributes.useStroke = false;
    }
    
    // Specify the stroke width for the next shape
    window.strokeWidth = function(n) {
        attributes.useStroke = true;
        attributes.strokeWidth = n;
    }
    
    // Specify the stroke color for the next shape
    window.stroke = function(color) {
        attributes.stroke = color;
    }
    
    // Draw a rectangle
    window.rect = function(x, y, width, height) {
        if (attributes.useFill) {
            ctx.fillStyle = attributes.fill;
            ctx.fillRect(x, y, width, height);
        }
            
        if (attributes.useStroke) {
            ctx.lineWidth = attributes.strokeWidth;
            ctx.strokeStyle = attributes.stroke;
            ctx.strokeRect(x, y, width, height);
        }
    }
    
    // Specify the text size of the next drawn text
    window.textSize = function(n) {
        attributes.textSize = n;
    }
    
    // Write a text at specified coordinates
    window.text = function(txt, x, y) {
        ctx.font = attributes.textSize + "px serif";
    
        ctx.fillStyle = attributes.fill;
        ctx.fillText(txt, x, y);
    }


    // Draw a line
    window.line = function(x1, y1, x2, y2) {
        if(attributes.useStroke) {
            ctx.lineWidth = attributes.strokeWidth;
            ctx.strokeStyle = attributes.stroke;
        } else {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Draw a triangle
    window.triangle = function(x1, y1, x2, y2, x3, y3) {
        ctx.beginPath();
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        if(attributes.useFill) {
            ctx.fillStyle = attributes.fill;
            ctx.fill();
        }

        if(attributes.useStroke) {
            ctx.lineWidth = attributes.strokeWidth;
            ctx.strokeStyle = attributes.stroke;
            ctx.stroke();
        }
    }

    // Draw a circle
    window.circle = function(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.closePath();

        if(attributes.useFill) {
            ctx.fillStyle = attributes.fill;
            ctx.fill();
        }

        if(attributes.useStroke) {
            ctx.lineWidth = attributes.strokeWidth;
            ctx.strokeStyle = attributes.stroke;
            ctx.stroke();
        }
    }

    window.rhombus = function(x, y, w, h) {
        ctx.beginPath();
        ctx.moveTo(x, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y);
        ctx.closePath();

        if(attributes.useFill) {
            ctx.fillStyle = attributes.fill;
            ctx.fill();
        }

        if(attributes.useStroke) {
            ctx.lineWidth = attributes.strokeWidth;
            ctx.strokeStyle = attributes.stroke;
            ctx.stroke();
        }
    }

    window.scale = function(scale) {
        ctx.save();
        ctx.scale(scale, scale);
    }

    window.noScale = function() {
        ctx.restore();
    }
    
    // Returns true if key with specified code is pressed
    window.keyIsDown = function(code) {
        if (keyPressed.has(code))
            return true;
    }


    window.game = new Game(width, height);
    
})("canvas");
