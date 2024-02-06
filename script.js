function binarySearch(array, targetWord, compareFunction) {
    let startIndex = 0;
    let endIndex = array.length - 1;

    while (startIndex <= endIndex) {
        let midIndex = Math.floor((startIndex + endIndex) / 2);
        let comparisonResult = compareFunction(targetWord, array[midIndex]);
        if (comparisonResult === 0) {
            return midIndex;
        } else if (comparisonResult < 0) {
            endIndex = midIndex - 1;
        } else {
            startIndex = midIndex + 1;
        }
    }
    return -1;
}

async function fetchData() {
    try {
        const response = await fetch("/ddo-fullform/ddo_fullforms_2023-10-11.csv");
        const rawText = await response.text();

        globalArrayOfWords = rawText.split("\n").map(line => {
            const parts = line.split("\t");
            return {
                variant: parts[0],
                headword: parts[1],
                homograph: parts[2],
                partofspeech: parts[3],
                id: parts[4]
            };
        });

        globalArrayOfWords.sort((a, b) => a.variant.localeCompare(b.variant));

        //console.log(globalArrayOfWords);
    } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
    }
}

function compareWords(word, object) {
    return word.localeCompare(object.variant);
}

fetchData().then(() => {
    const targetWord = "hestevogn";

    performance.mark('startBinarySearch');
    const binarySearchIndex = binarySearch(globalArrayOfWords, targetWord, compareWords);
    performance.mark('endBinarySearch');
    performance.measure('binarySearch', 'startBinarySearch', 'endBinarySearch');
    
    performance.mark('startFindIndex');
    const findIndex = globalArrayOfWords.findIndex(wordObject => wordObject.variant === targetWord);
    performance.mark('endFindIndex');
    performance.measure('findIndex', 'startFindIndex', 'endFindIndex');

    console.log("Binary search time:", performance.getEntriesByName('binarySearch')[0].duration);
    console.log("findIndex time:", performance.getEntriesByName('findIndex')[0].duration);

    if (binarySearchIndex !== -1 && findIndex !== -1) {
        //console.log("Object found on index: ", globalArrayOfWords[binarySearchIndex]);
    } else {
        //console.log("Object not found.");
    }
});
    