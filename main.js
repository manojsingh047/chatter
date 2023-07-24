"use strict";

import { ACTION, fetchApi } from "./utils";

$(document).ready(function () {
    function TestCaseModel(id, name, isSelected) {
        this.id = id;
        this.name = name;
        this.isSelected = isSelected;
    }


    function DataModel() {
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

    function UtilityView() {
        this.utilityContainerEle = "#utility-container";
        this.casesBoxEle = "#utility-container #cases-box";
        this.mobiContainerEle = "#mobi-container";
        this.scrollerEle = "#scroller";
        this.shouldToggleUtility = false;
        this.isUtilityExpanded = false;
        this.isScrolleOn = false;
    }


    UtilityView.prototype.expandUtilityContainer = function () {
        this.isUtilityExpanded = true;
        $(chatView.chatContainerEle).animate({
            "height": "60%"
        }, () => {
            $(this.utilityContainerEle).css({ "display": "block" });
            chatView.scrollToBottom();
        });

    };

    UtilityView.prototype.showMobiContainer = function () {
        $(this.mobiContainerEle).css({ "display": "block" });
    };

    UtilityView.prototype.hideMobiContainer = function () {
        $(this.mobiContainerEle).css({ "display": "none" });
    };


    UtilityView.prototype.hideUtilityContainer = function () {
        this.isUtilityExpanded = false;
        $(this.utilityContainerEle).css({ "display": "none" });
        $(chatView.chatContainerEle).animate({
            "height": "91%"
        }, 300);
    };

    UtilityView.prototype.hideCasesBox = function () {
        $(this.casesBoxEle).css({ "display": "none" });
    };

    UtilityView.prototype.showCasesBox = function () {
        $(this.casesBoxEle).css({ "display": "block" });
    };

    UtilityView.prototype.attachUtilityToggler = function () {
        $(inputView.inputContainerEle).on('click', () => {
            if (this.canToggleUtility()) {

                if (this.isUtilityExpanded) {
                    this.hideUtilityContainer();
                } else {
                    this.expandUtilityContainer();
                }

            }
        });
    };

    UtilityView.prototype.canToggleUtility = function () {
        return this.shouldToggleUtility;
    };

    UtilityView.prototype.getTestCasesHtml = function (testCase) {
        return `<div class="test-cases" id="${testCase.id}"><span>${testCase.name}</span></div>`;
    };


    UtilityView.prototype.renderUtilitySelectors = function (testCases) {
        this.shouldToggleUtility = true;

        let testCasesHtml = "";

        if (testCases.length === 0) {
            this.hideUtilityContainer();
            this.shouldToggleUtility = false;
            return;
        }

        testCases.forEach((testCase) => {
            testCasesHtml += this.getTestCasesHtml(testCase);
        });

        $(this.casesBoxEle).html(testCasesHtml);

        this.attachTestCasesEvent();
        this.attachTestSendEvent();
        this.expandUtilityContainer();
        this.showCasesBox();
    };

    UtilityView.prototype.attachTestSendEvent = function () {

        $(inputView.sendBoxEle).on('click', (event) => {
            event.stopPropagation();
            if ($(inputView.inputEle).val().length === 0) {
                return false;
            }
            chatView.renderMyMsgs($(inputView.inputEle).val());
            inputView.clearInputVal();
            this.hideUtilityContainer();

            const activeCase = dataModel.getActiveTestCase();
            chatView.fetchAndRenderBotMsgs(activeCase.id);
            return;
        });
    };

    UtilityView.prototype.attachTestCasesEvent = function () {
        $(this.casesBoxEle + ' .test-cases').on('click', function () {
            $(this).toggleClass("selected-test");
            utilityView.updateTestCasesState(this.id);
            inputView.updateSendState();
        });
    };

    UtilityView.prototype.updateTestCasesState = function (id) {
        dataModel.toggleSelected(id);
        dataModel.removeSelected(id);
        inputView.toggleInputValue(dataModel.getSingleTestCases(id));
        utilityView.removeSelectedFromCase(id);
    };

    UtilityView.prototype.removeSelectedFromCase = function (id) {
        dataModel.getTestCases().forEach(testCase => {
            if (testCase.id !== id) {
                $(this.casesBoxEle + ' ' + '#' + testCase.id).removeClass("selected-test");
            }
        });
    };

    UtilityView.prototype.disableEsc = function () {
        $(document).keydown(function (e) {
            if (e.keyCode === 27) return false;
        });
    };

    function InputView() {
        this.inputContainerEle = "#input-container";
        this.inputEle = "#input-container input";
        this.sendBoxEle = "#input-container #plane-box";
        this.sendEle = "#input-container #plane-box i";
        this.inputEleIsActive = false;
    }

    InputView.prototype.clearInputVal = function () {
        $(this.inputEle).val('');
    };

    InputView.prototype.updateSendState = function () {
        this.inputEleIsActive = $(this.inputEle).val().length > 0;
        if (this.inputEleIsActive) {
            $(this.sendEle).hide().fadeIn(500);
            $(this.sendEle).addClass('active');
        } else {
            $(this.sendEle).hide().fadeIn(500);
            $(this.sendEle).removeClass('active');
        }
    };

    InputView.prototype.toggleInputValue = function (testCase) {

        let ipVal = testCase.isSelected ? testCase.name : "";

        $(this.inputEle).val(ipVal);
    };


    function ChatView() {
        this.chatContainerEle = "#chats-container";
    }

    ChatView.prototype.init = function () {
        chatView.fetchAndRenderBotMsgs('initial');
        utilityView.attachUtilityToggler();
        utilityView.disableEsc();
    };


    ChatView.prototype.getBotMsgHtml = function (msg) {
        return `<div class="chat bot-chat dis-flex">
                <span class="msg">${msg}</span>
            </div>`;
    };

    ChatView.prototype.renderBotMsgs = function (msgs) {
        msgs.forEach((msg) => {
            $(this.getBotMsgHtml(msg)).hide().appendTo(this.chatContainerEle).fadeIn(500);
        });
    };

    ChatView.prototype.fetchAndRenderBotMsgs = async function (id) {
        chatView.renderBotLoader();
        const res = await fetchApi(id);
        dataModel.removeTestCase();
        chatView.removeBotLoader();
        utilityView.renderUtilitySelectors(dataModel.getTestCases());

        chatView.renderBotMsgs(res.messages);
    };

    ChatView.prototype.getMyMsgHtml = function (msg) {
        return `<div class="chat my-chat dis-flex">
                <span class="msg">${msg}</span>
            </div>`;
    };

    ChatView.prototype.renderMyMsgs = function (msg) {

        if (msg.length === 0)
            return false;

        $(this.getMyMsgHtml(msg)).hide().appendTo(this.chatContainerEle).fadeIn(500);
        this.scrollToBottom();
    };

    ChatView.prototype.scrollToBottom = function () {
        $(this.chatContainerEle).animate({ scrollTop: $(this.chatContainerEle).prop("scrollHeight") });
    };

    ChatView.prototype.renderBotLoader = function () {
        let loaderHtml = `<div class="chat bot-chat dis-flex">
                <span class="msg">
                    <div id="wave">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </span>
            </div>`;

        $(loaderHtml).hide().appendTo(this.chatContainerEle).fadeIn(500);

    };

    ChatView.prototype.removeBotLoader = function () {
        $(this.chatContainerEle + " .bot-chat:last-child").remove();
    };


    let dataModel = new DataModel();
    let chatView = new ChatView();
    let utilityView = new UtilityView();
    let inputView = new InputView();

    chatView.init();

});


