window.abTests = window.abTests || {};
window.abTests.isTestReady = false;

window.abTests.pendingTests = [];

function setTestActive(testName) {
    if (!window.abTests.isTestReady) {
        if (!window.abTests.pendingTests.includes(testName)) {
            console.log('Added pending test: ' + testName);
            window.abTests.pendingTests.push(testName);
        }
        return;
    }

    try {
        if (window.abTests.activeTests?.includes(testName)) return;
        let testElement = window.abTests.testList[testName];
        if (testElement) {
            testElement.classList.add('ab__test--active-test');
            let affectedElements = document.querySelectorAll(`[data-test-name="${testName}"]`);
            Array.from(affectedElements).forEach(function(n) {
                n.classList.add('ab__test--active-test');
                if (n.classList.contains('ab__test-hide')) {
                    n.classList.add('hidden');
                }
            });
    
            window.abTests.activeTests.push(testName);
            console.log(`Test ${testName} activated`); // Corrected template literal
        } else {
            console.error('Unable to find test: ' + testName);
        }
    } catch (e) {
        console.error('Unable to activate test: ' + testName);
        console.error(e);
    }
}

window.abTests = {
    ...window.abTests,
    setTestActive,
    activeTests: [], // Initialize activeTests here
};

function prepTestsInWindow() {
    try {
        let allTests = document.querySelectorAll('.ab__test');
        let testList = Array.from(allTests).reduce((prev, n) => ({
            ...prev, [n.dataset.testName]: n
        }), {}); // Fixed syntax error
        console.log(testList, "test list=>>>");
        
        window.abTests.isTestReady = true;
        window.abTests.testList = testList;

        if (window.abTests.pendingTests.length > 0) {
            window.abTests.pendingTests.forEach((n) => setTestActive(n));
        }
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', prepTestsInWindow);