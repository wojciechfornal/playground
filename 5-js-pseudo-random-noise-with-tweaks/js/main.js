/**
 * @author: Wojciech Fornal <wojciech.fornal@gmail.com>
 */
(function main() {

    const canvas = document.querySelector('canvas');

    if (!canvas.getContext) {
        return;
    }

    const RGBAIndex = {
        R: 0,
        G: 1,
        B: 2,
        A: 3
    };

    const ColorMode = {
        COLOR: 'COLOR',
        GRAYSCALE: 'GRAYSCALE'
    };

    const ctx2D = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const colorRangeMinVal = 0;
    const colorRangeMaxVal = 255;
    const colorRangeMinSlider = document.getElementById('colorRangeMin');
    const colorRangeMaxSlider = document.getElementById('colorRangeMax');
    const colorRangeMinText = document.getElementById('colorRangeMinText');
    const colorRangeMaxText = document.getElementById('colorRangeMaxText');
    const vibranceSlider = document.getElementById('vibranceSlider');
    const vibranceText = document.getElementById('vibranceText');
    const middleThresholdSlider = document.getElementById('middleThreshold');
    const middleThresholdText = document.getElementById('middleThresholdText');
    const cellSizeSlider = document.getElementById('cellSize');
    const cellSizeText = document.getElementById('cellSizeText');

    let vibrance = 15;
    let colorRangeMin = colorRangeMinVal;
    let colorRangeMax = colorRangeMaxVal;
    let cellSize = 10;
    let middleThreshold = 1;

    const vibranceUpdateHandler = (evt) => {

        if (!evt) return;

        const element = evt.target;
        const rawVal = element.value;

        vibrance = parseInt(rawVal, 10);
        vibranceText.textContent = vibrance;

    };

    const thresholdUpdateHandler = (evt) => {

        if (!evt) return;
        if (evt.buttons !== 1) return;

        const element = evt.target;
        const rawVal = element.value;

        switch (element.id) {
            case 'colorRangeMax':
                val = colorRangeMaxVal - parseInt(rawVal, 10);
                colorRangeMaxText.textContent = val;
                colorRangeMax = val;
                if (colorRangeMax < colorRangeMin) {
                    colorRangeMin = colorRangeMax;
                    colorRangeMinSlider.value = colorRangeMin;
                    colorRangeMinText.textContent = colorRangeMin;
                }
                break;
            case 'colorRangeMin':
                val = parseInt(rawVal, 10);
                colorRangeMinText.textContent = val;
                colorRangeMin = val;
                if (colorRangeMin > colorRangeMax) {
                    colorRangeMax = colorRangeMin;
                    colorRangeMaxSlider.value = colorRangeMaxVal - colorRangeMin;
                    colorRangeMaxText.textContent = colorRangeMax;
                }
                break;
        }

    };

    const middleThresholdUpdateHandler = (evt) => {

        if (!evt) return;
        if (evt.buttons !== 1) return;

        const element = evt.target;
        const rawVal = element.value;
        middleThreshold = rawVal;

        middleThresholdText.textContent = middleThreshold;

    }

    const cellSizeUpdateHandler = (evt) => {

        if (!evt) return;
        if (evt.buttons !== 1) return;

        const element = evt.target;
        const rawVal = element.value;
        cellSize = rawVal;

        cellSizeText.textContent = cellSize;

    }

    colorRangeMinSlider.addEventListener('click', thresholdUpdateHandler);
    colorRangeMinSlider.addEventListener('mousemove', thresholdUpdateHandler);
    colorRangeMaxSlider.addEventListener('click', thresholdUpdateHandler);
    colorRangeMaxSlider.addEventListener('mousemove', thresholdUpdateHandler);
    vibranceSlider.addEventListener('click', vibranceUpdateHandler);
    vibranceSlider.addEventListener('mousemove', vibranceUpdateHandler);
    middleThresholdSlider.addEventListener('click', middleThresholdUpdateHandler);
    middleThresholdSlider.addEventListener('mousemove', middleThresholdUpdateHandler);
    cellSizeSlider.addEventListener('click', cellSizeUpdateHandler);
    cellSizeSlider.addEventListener('mousemove', cellSizeUpdateHandler);

    // x : column
    // y : row
    // n : RGBA component index in a tuple, R = 0, G = 1, B = 2, A = 3
    // y * (w * 4) + (x * 4) + n : mapping from (x, y) coordinates to beginning index of particular RGBA tuple in image data

    const imageData = ctx2D.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    const drawCell = (x, y, cellSize, color) => {

        let rgbaTupleIndex = y * (canvasWidth * 4) + (x * 4);

        data[rgbaTupleIndex + RGBAIndex.R] = color;
        data[rgbaTupleIndex + RGBAIndex.G] = color;
        data[rgbaTupleIndex + RGBAIndex.B] = color;
        data[rgbaTupleIndex + RGBAIndex.A] = 255;
        
    }

    let palette = [];

    const redraw = () => {

        for (let y = 0; y < canvasHeight; y += 1) {

            if (y % cellSize === 0) {
                
                palette = [];
                
                for (let i = 0; i < Math.ceil(canvasWidth / cellSize); i++) {
                    let color = colorRangeMin + Math.ceil(Math.random() * (colorRangeMax - colorRangeMin));
                    palette.push(color);
                }

            }

            let colorIndex = 0;

            for (let x = 0; x < canvasWidth; x += 1) {

                //*

                let color = palette[colorIndex];

                let avg = Math.round((colorRangeMin + colorRangeMax) / 2);
                var lowerRangeMax = Math.round(colorRangeMin + ((avg - colorRangeMin) * middleThreshold));
                var upperRangeMin = Math.round(colorRangeMax - ((colorRangeMax - avg) * middleThreshold));
                let vibranceCheck = Math.ceil(Math.random() * 100);

                if (x % cellSize === 0) {
                    colorIndex++;
                }

                if (color <= lowerRangeMax || color > upperRangeMin) {
                    if (vibranceCheck < vibrance) {
                        drawCell(x, y, cellSize, color);
                    }
                }

                //*/

            }
        }

        ctx2D.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx2D.putImageData(imageData, 0, 0);

        window.requestAnimationFrame(redraw);

    };

    window.requestAnimationFrame(redraw);

})();