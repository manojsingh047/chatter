import { ACTION } from "./utils";

function TestCaseModel(id, name, isSelected) {
    this.id = id;
    this.name = name;
    this.isSelected = isSelected;
}


export function DataModel() {
    let testCases = [
        new TestCaseModel(
            ACTION.mom.key,
            ACTION.mom.label,
            false,

        ),
        new TestCaseModel(
            ACTION.retro.key,
            ACTION.retro.label,
            false,

        ),
        new TestCaseModel(
            ACTION.story.key,
            ACTION.story.label,
            false,
        ),
    ];

    return {
        getTestCases: function () {
            return testCases;
        },
        getSingleTestCases: function (id) {
            return testCases.find(testCase => testCase.id === id);
        },
        toggleSelected: function (id) {
            testCases.forEach(testCase => {
                if (testCase.id === id) {
                    testCase.isSelected = !testCase.isSelected;
                }
            });
        },
        removeSelected: function (id) {
            this.getTestCases().forEach(testCase => {
                if (testCase.id !== id) {
                    testCase.isSelected = false;
                }
            });
        },
        getActiveTestCase: function () {
            return testCases.find(testCase => testCase.isSelected);
        },
        removeTestCase: function () {
            let activeTestCase = this.getActiveTestCase();
            if (!activeTestCase) {
                return;
            }
            let testCaseIndex = testCases.findIndex(testCase => activeTestCase.id === testCase.id);

            this.getTestCases().splice(testCaseIndex, 1);
        },

    };

}
