const arrayContainer = document.getElementById("array-container");
const arraySizeInput = document.getElementById("arraySize");
const sortSpeedInput = document.getElementById("sortSpeed");
const generateArrayBtn = document.getElementById("generateArray");
const startSortBtn = document.getElementById("startSort");
const algorithmSelect = document.getElementById("algorithmSelect");

let array = [];
let delay = 100;

function generateArray(size = 50) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 10);
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = "";
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("array-bar");
        bar.style.height = `${value}px`;
        bar.style.width = `${800 / array.length - 4}px`;
        arrayContainer.appendChild(bar);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function swap(i, j) {
    const bars = document.getElementsByClassName("array-bar");
    bars[i].classList.add("comparing");
    bars[j].classList.add("comparing");

    await sleep(delay);

    [array[i], array[j]] = [array[j], array[i]];
    renderArray();

    bars[i].classList.remove("comparing");
    bars[j].classList.remove("comparing");
}

async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        await swap(i, minIdx);
    }
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j] < array[j - 1]) {
            await swap(j, j - 1);
            j--;
        }
    }
}

async function mergeSortHelper(arr, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSortHelper(arr, l, m);
    await mergeSortHelper(arr, m + 1, r);
    await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
        renderArray();
        await sleep(delay);
    }

    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
    renderArray();
}

async function mergeSort() {
    await mergeSortHelper(array, 0, array.length - 1);
}

async function quickSortHelper(arr, low, high) {
    if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }
    await swap(i + 1, high);
    return i + 1;
}

async function quickSort() {
    await quickSortHelper(array, 0, array.length - 1);
}

generateArrayBtn.addEventListener("click", () => {
    generateArray(parseInt(arraySizeInput.value));
});

arraySizeInput.addEventListener("input", () => {
    generateArray(parseInt(arraySizeInput.value));
});

sortSpeedInput.addEventListener("input", () => {
    delay = 600 - parseInt(sortSpeedInput.value) * 100;
});

startSortBtn.addEventListener("click", async () => {
    switch (algorithmSelect.value) {
        case "bubbleSort": await bubbleSort(); break;
        case "selectionSort": await selectionSort(); break;
        case "insertionSort": await insertionSort(); break;
        case "mergeSort": await mergeSort(); break;
        case "quickSort": await quickSort(); break;
    }
});

generateArray(parseInt(arraySizeInput.value));
