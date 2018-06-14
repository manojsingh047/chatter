"use strict";


$(document).ready(function () {

    function TestCaseModel(id, name, isSelected, options) {
        this.id = id;
        this.name = name;
        this.isSelected = isSelected;
        this.options = options
    }


    function DataModel() {

        let now = new Date();

        let testCases = [
            new TestCaseModel(
                "ip_date",
                "Date Test",
                false,
                {
                    min:new Date(now.getFullYear() - 5, 0, 1),
                    max:new Date(now.getFullYear() + 5, 11, 31)
                }
            ),
            new TestCaseModel(
                "ip_time",
                "Time Test",
                false,
                {
                    min:new Date(now.setHours(10, 30)),
                    max:new Date(now.setHours(18, 59))
                }
            ),
            new TestCaseModel(
                "ip_datetime",
                "Date-Time Test",
                false,
                {}
            ),
        ];

        let initialBotMsgs = [
            `Hello team Tars !`,
            `Hope you are having a great day.`,
            `In the section below your are provided with set of options 
            to test various inputs.`,
            `Go ahead and play with it.`
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
                    if(testCase.id === id){
                        testCase.isSelected = !testCase.isSelected;
                    }
                });
            },
            removeSelected: function (id) {
                this.getTestCases().forEach(testCase => {
                    if(testCase.id !== id){
                        testCase.isSelected = false;
                    }
                });
            },
            getinitialBotMsgs: function () {
                return initialBotMsgs;
            },
            getActiveTestCase: function () {
                return testCases.find(testCase => testCase.isSelected);
            },
            removeTestCase: function () {
                let testCaseIndex = testCases.findIndex(
                    testCase => this.getActiveTestCase().id === testCase.id);

                this.getTestCases().splice(testCaseIndex,1);
            },

        };

    }

    let MockNetworkCalls = {

        fetchInitialData: async function () {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve(dataModel.getinitialBotMsgs());
                }, 1000);
            });

            try {
                chatView.renderBotLoader();
                let result = await promise;
                chatView.removeBotLoader();
                chatView.renderBotMsgs(result);

                setTimeout(() => {
                    this.fetchTestCases();
                }, 500);
            }
            catch (err) {
                console.error(err);
            }
        },

        fetchTestCases: async function () {
            let promise = new Promise((resolve, reject) => {
                return resolve(dataModel.getTestCases());
            });

            try {
                let result = await promise;
                utilityView.renderUtilitySelectors(result);
            }
            catch (err) {
                console.error(err);
            }
        },
    };

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
            $(this.utilityContainerEle).css({"display": "block"});
            chatView.scrollToBottom();
        });

    };

    UtilityView.prototype.showMobiContainer = function () {
            $(this.mobiContainerEle).css({"display": "block"});
    };

    UtilityView.prototype.hideMobiContainer = function () {
            $(this.mobiContainerEle).css({"display": "none"});
    };


    UtilityView.prototype.hideUtilityContainer = function () {
        this.isUtilityExpanded = false;
        $(this.utilityContainerEle).css({"display": "none"});
        $(chatView.chatContainerEle).animate({
            "height": "91%"
        }, 300);
    };

    UtilityView.prototype.hideCasesBox = function () {
        $(this.casesBoxEle).css({"display": "none"});
    };

    UtilityView.prototype.showCasesBox = function () {
        $(this.casesBoxEle).css({"display": "block"});
    };

    UtilityView.prototype.attachUtilityToggler = function () {
        $(inputView.inputContainerEle).on('click', () => {
            if (this.canToggleUtility()) {

                if(this.isUtilityExpanded){
                    this.hideUtilityContainer();
                } else{
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

        if(testCases.length === 0){
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

        $(inputView.sendBoxEle).on('click',(event) => {
            event.stopPropagation();
            if($(inputView.inputEle).val().length === 0){
                return false;
            }
            chatView.renderMyMsgs($(inputView.inputEle).val());

            if(this.isScrolleOn){
                dataModel.removeTestCase();

                this.hideUtilityContainer();
                chatView.renderBotLoader();

                setTimeout(() => {
                    chatView.removeBotLoader();
                    this.renderUtilitySelectors(dataModel.getTestCases());
                },2000);

                this.hideMobiContainer();
            }else{
                this.hideCasesBox();
                this.renderScroller();
            }
            this.isScrolleOn = !this.isScrolleOn;


            inputView.clearInputVal();
            inputView.updateSendState();

        });
    };




    UtilityView.prototype.attachTestCasesEvent = function () {
        $(this.casesBoxEle + ' .test-cases').on('click', function () {
            $(this).toggleClass("selected-test");
            utilityView.updateTestCasesState(this.id);
            inputView.updateSendState();
        });
    };

    UtilityView.prototype.renderScroller = function () {

        chatView.renderBotLoader();
        utilityView.showMobiContainer();
        chatView.removeBotLoader();

        let curTestCase = dataModel.getActiveTestCase();
        switch (curTestCase.id){
            case "ip_date" :
                $(this.scrollerEle).mobiscroll().date({
                    min:curTestCase.options.min,
                    max:curTestCase.options.max,
                    onSet: () => inputView.updateSendState()
                });
                break;

            case "ip_time" :
                $(this.scrollerEle).mobiscroll().time({
                    min:curTestCase.options.min,
                    max:curTestCase.options.max,
                    onSet: () => inputView.updateSendState()
                });
                break;

            case "ip_datetime" :
                $(this.scrollerEle).mobiscroll().datetime({
                    onSet: () => inputView.updateSendState()
                });
                break;
        }

        $(this.scrollerEle).mobiscroll('show');

    };

    UtilityView.prototype.updateTestCasesState = function (id) {
        dataModel.toggleSelected(id);
        dataModel.removeSelected(id);
        inputView.toggleInputValue(dataModel.getSingleTestCases(id));
        utilityView.removeSelectedFromCase(id);
    };


    UtilityView.prototype.removeSelectedFromCase = function (id) {
        dataModel.getTestCases().forEach(testCase => {
            if(testCase.id !== id){
                $(this.casesBoxEle + ' ' + '#' + testCase.id).removeClass("selected-test");
            }
        });
    };

    UtilityView.prototype.disableEsc = function () {
        $(document).keydown(function(e) {
            if (e.keyCode === 27) return false;
        });
    };


    UtilityView.prototype.setScrollGlobalSettings = function () {
        mobiscroll.settings = {
            theme: 'ios-dark',
            cssClass: "wheeler",
            context: '#mobi-container',
            buttons:[]
        };
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
        if(this.inputEleIsActive){
            $(this.sendEle).hide().fadeIn(500);
            $(this.sendEle).addClass('active');
        }else{
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
        MockNetworkCalls.fetchInitialData();
        utilityView.attachUtilityToggler();
        utilityView.disableEsc();
        utilityView.setScrollGlobalSettings();
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

    ChatView.prototype.getMyMsgHtml = function (msg) {
        return `<div class="chat my-chat dis-flex">
                <span class="msg">${msg}</span>
            </div>`;
    };

    ChatView.prototype.renderMyMsgs = function (msg) {

        if(msg.length === 0)
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


