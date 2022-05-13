const fs = require('fs');
const getStream = require('get-stream');
const { parse } = require('csv-parse');

const filePath = './input.csv';

// read csv file
const readCSVData = async (filePath) => {
    const parseStream = parse({ delimiter: ',' });
    const data = await getStream.array(
        fs.createReadStream(filePath).pipe(parseStream)
    );
    return data;
};

const validateNumbers = (array) => {
    const validate = [];
    array.forEach((row) => {
        row.forEach((number) => {
            validate.push(number >= 0 && number <= 9);
        });
    });

    return validate.every((number) => number === true);
};

const validate = (array) => {
    // filter out empty spaces
    const digits = array.filter((character) => character !== '.');
    return digits.length === [...new Set(digits)].length;
};

const isValidSudoku = (board) => {
    const [validated, grids] = [[], []];

    board.forEach((row, rowIndex) => {
        // rows
        validated.push(validate(row));

        // columns
        const column = [];
        for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
            column.push(board[columnIndex][rowIndex]);
        }
        validated.push(validate(column));

        //grids
        grids.push([]);
    });

    //grids
    board.forEach((row, rowIndex) => {
        row.forEach((character, charIndex) => {
            let gridRow = 0;
            if (rowIndex >= 3 && rowIndex <= 5) {
                gridRow = 1;
            } else if (rowIndex >= 6 && rowIndex <= 8) {
                gridRow = 2;
            }

            if (charIndex >= 3 && charIndex <= 5) {
                gridRow += 3;
            } else if (charIndex >= 6 && charIndex <= 8) {
                gridRow += 6;
            }

            grids[gridRow].push(character);
        });
    });

    grids.forEach((grid) => {
        validated.push(validate(grid));
    });

    // console.log({ validated });
    return validated.every((value) => value === true);
};

const main = async () => {
    const data = await readCSVData(filePath);
    if (!validateNumbers(data)) {
        console.log(false);
    } else {
        console.log(isValidSudoku(data));
    }
};

main();
