const colorPallet = document.querySelector('#color-palette');
const pixelBoard = document.querySelector('#pixel-board');
const divColorsPaletteSelector = '#color-palette .color';

const guide = ['#000000', '#808080', '#6A5ACD', '#000080', '#00BFFF',
  '#008080', '#006400', '#8B4513', '#D2691E', '#4B0082',
  '#8B008B', '#FF0000', '#FF4500', '#FFFF00', '#B0E0E6'];

const generateRandomNumber = (number) => Math.floor(Math.random() * (number));

const generateColorGuide = (amountOfColor) => {
  const arrayOfColor = ['#000000'];
  while (arrayOfColor.length < amountOfColor) {
    const randomNumber = generateRandomNumber(guide.length);
    if (!arrayOfColor.includes(guide[randomNumber])) {
      arrayOfColor.push(guide[randomNumber]);
    }
  }
  return arrayOfColor;
};

const limitSizeBoard = (number) => {
  let sizeNumber = number;
  if (sizeNumber < 5) {
    sizeNumber = 5;
  }

  if (sizeNumber > 50) {
    sizeNumber = 50;
  }
  return sizeNumber;
};

const savePaletteLocalStorage = () => {
  const colorsToSave = document.querySelectorAll(divColorsPaletteSelector);
  const colorGuide = [];
  for (let index = 0; index < colorsToSave.length; index += 1) {
    colorGuide.push(colorsToSave[index].style.backgroundColor);
  }
  localStorage.setItem('colorPalette', JSON.stringify(colorGuide));
};

const recoveryLocalStorePalette = () => {
  const colorGuideLocalStorage = localStorage.getItem('colorPalette');
  if (colorGuideLocalStorage) {
    return JSON.parse(colorGuideLocalStorage);
  }

  return generateColorGuide(4);
};

const savePaintLocalStorage = () => {
  const rowDivs = document.querySelectorAll('.rowDiv');
  const objPaint = {};
  for (let indexRow = 0; indexRow < rowDivs.length; indexRow += 1) {
    const pixels = rowDivs[indexRow].querySelectorAll('.pixel');
    objPaint[`linha_${indexRow}`] = [];

    for (let indexPixel = 0; indexPixel < pixels.length; indexPixel += 1) {
      const backgroundPixel = pixels[indexPixel].style.backgroundColor;
      objPaint[`linha_${indexRow}`].push(backgroundPixel);
    }
  }
  localStorage.setItem('pixelBoard', JSON.stringify(objPaint));
};

const recoveryLocalStorePaint = () => {
  const LocalStoragePaint = localStorage.getItem('pixelBoard');
  if (LocalStoragePaint) {
    return JSON.parse(LocalStoragePaint);
  }
};

const recoveryLocalStoreSizeBoard = () => {
  const LocalStorageSize = localStorage.getItem('boardSize');
  if (LocalStorageSize) {
    return JSON.parse(LocalStorageSize);
  }
};

const saveSizeBoardLocalStorage = (sizeNumber) => {
  const boardSizeNumber = limitSizeBoard(sizeNumber);
  localStorage.setItem('boardSize', boardSizeNumber);
};

const applyColorPalette = (arrayColor) => {
  const divColors = document.querySelectorAll(divColorsPaletteSelector);

  for (let index = 0; index < arrayColor.length; index += 1) {
    if (index === 0) {
      divColors[index].classList.add('selected');
      divColors[index].style.backgroundColor = arrayColor[index];
    } else {
      divColors[index].style.backgroundColor = arrayColor[index];
      divColors[index].className = 'color';
    }
  }
};

const createButtons = () => {
  const buttonRefresh = document.createElement('button');

  buttonRefresh.className = 'buttons';

  buttonRefresh.id = 'button-random-color';

  buttonRefresh.textContent = 'Cores aleatórias';

  return [buttonRefresh];
};

const createColorPalette = () => {
  const colorGuide = recoveryLocalStorePalette();

  for (let index = 0; index < colorGuide.length; index += 1) {
    const divColor = document.createElement('div');
    divColor.className = 'color';
    colorPallet.appendChild(divColor);
  }

  applyColorPalette(colorGuide);
  const buttons = createButtons();

  colorPallet.appendChild(buttons[0]);
};

const restorePaint = (paint) => {
  const rowDivs = document.querySelectorAll('.rowDiv');
  const colorPixels = Object.values(paint);

  for (let indexRow = 0; indexRow < colorPixels.length; indexRow += 1) {
    const rowPixels = colorPixels[indexRow];
    const rowDiv = rowDivs[indexRow].querySelectorAll('.pixel');

    for (let indexPixel = 0; indexPixel < rowPixels.length; indexPixel += 1) {
      rowDiv[indexPixel].style.backgroundColor = rowPixels[indexPixel];
    }
  }
};

const createPixelBoard = (number) => {
  const numberOfPixels = limitSizeBoard(number);
  for (let indexPixel = 0; indexPixel < numberOfPixels; indexPixel += 1) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('rowDiv');
    for (let indexRow = 0; indexRow < numberOfPixels; indexRow += 1) {
      const pixelDiv = document.createElement('div');
      pixelDiv.classList.add('pixel');
      rowDiv.appendChild(pixelDiv);
    }

    pixelBoard.appendChild(rowDiv);
  }
};

const initiatePixelBoard = () => {
  const paint = recoveryLocalStorePaint();
  if (paint) {
    const lengthPixelBoardRecovery = Object.keys(paint).length;
    createPixelBoard(lengthPixelBoardRecovery);
    restorePaint(paint);
  } else {
    const numberOfPixels = recoveryLocalStoreSizeBoard() || 5;
    createPixelBoard(Number(numberOfPixels));
  }
};

const resizePixelBoard = (numberOfPixels) => {
  const pixelBoardChildrens = pixelBoard.querySelectorAll('.rowDiv');
  for (let index = 0; index < pixelBoardChildrens.length; index += 1) {
    pixelBoardChildrens[index].remove();
  }

  localStorage.removeItem('pixelBoard');
  createPixelBoard(Number(numberOfPixels));
};

const resetPixelBoard = () => {
  const pixels = document.querySelectorAll('#pixel-board .pixel');

  for (let index = 0; index < pixels.length; index += 1) {
    pixels[index].style.backgroundColor = 'white';
  }
  localStorage.removeItem('pixelBoard');
};

const resizePixelBoardEvent = (element) => {
  const lenghtPixelBoard = element.previousElementSibling.value;
  if (lenghtPixelBoard === '') {
    alert('Board inválido!');
  } else {
    saveSizeBoardLocalStorage(lenghtPixelBoard);
    resizePixelBoard(lenghtPixelBoard);
  }
};

const changeSelectedColor = (element) => {
  const isElementSelected = element.classList.contains('selected');
  const existElementSelected = document.querySelector('.selected');
  if (!isElementSelected && !existElementSelected) {
    element.classList.add('selected');
  } else {
    document.querySelector('.selected').classList.remove('selected');
    element.classList.add('selected');
  }
};

const paintPixelDiv = (element) => {
  const colorSelected = document.querySelector('.selected');
  const pixelClicked = element;
  pixelClicked.style.backgroundColor = colorSelected.style.backgroundColor;
  savePaintLocalStorage();
};

const refreshColorPalette = () => {
  const buttonRefresh = document.querySelector('#button-random-color');
  buttonRefresh.addEventListener('click', () => {
    const divColors = document.querySelectorAll(divColorsPaletteSelector);
    const colorGuide = generateColorGuide(divColors.length);
    applyColorPalette(colorGuide);
    savePaletteLocalStorage();
  });
};

const addEventButtons = () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('color')) changeSelectedColor(event.target);

    if (event.target.classList.contains('pixel')) paintPixelDiv(event.target);

    if (event.target.id === 'clear-board') resetPixelBoard();

    if (event.target.id === 'generate-board') resizePixelBoardEvent(event.target);
  });
};

createColorPalette();
initiatePixelBoard();
refreshColorPalette();
addEventButtons();