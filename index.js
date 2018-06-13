"use strict";


$(document).ready(function () {

    function TestCaseModel(id, name) {
        this.id = id;
        this.name = name;
        this.isSelected = false;
    }


    function DataModel() {
        let testCases = [
            new TestCaseModel("ip_date", "Date Test"),
            new TestCaseModel("ip_time", "Time Test"),
            new TestCaseModel("ip_datetime", "Date-Time Test"),
        ];

        let initialBotMsgs = [
            "Hey There",
            "How are you doing?",
            "How are you doing1?",
            "How are you doing2?",
        ];


        return {
            getTestCases: function () {
                return testCases;
            },
            getSingleTestCases: function (id) {
                return testCases.find(testCase => testCase.id === id);
            },
            isActive : function (id) {
                return this.getSingleTestCases(id).isSelected;
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

        };

    }

    let MockNetworkCalls = {

        fetchInitialData: async function () {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve(dataModel.getinitialBotMsgs());
                }, 100);
            });

            try {
                chatView.renderBotLoader();
                let result = await promise;
                chatView.removeBotLoader();
                chatView.renderBotMsgs(result);
                this.fetchTestCases();
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
                console.log(result);
            }
            catch (err) {
                console.error(err);
            }
        }


    };

    function UtilityView() {
        this.utilityContainerEle = "#utility-container";
        this.shouldToggleUtility = false;
        this.isUtilityExpanded = false;

    }


    UtilityView.prototype.expandUtilityContainer = function () {
        this.isUtilityExpanded = true;
        $(chatView.chatContainerEle).animate({
            "height": "50%"
        }, () => {
            $(this.utilityContainerEle).css({"display": "block"});
        });

    };


    UtilityView.prototype.hideUtilityContainer = function () {
        this.isUtilityExpanded = false;
        $(this.utilityContainerEle).css({"display": "none"});
        // $(chatView.chatContainerEle).animate({
        //     "height": "91%"
        // }, 300);
    };

    UtilityView.prototype.attachUtilityToggler = function () {
        $(inputView.inputContainerEle).on('click', () => {
            if (this.canToggleUtility()) {
                this.isUtilityExpanded ? this.hideUtilityContainer() : this.expandUtilityContainer();

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
        this.shouldToggleUtility = true;   //todo -- check this

        testCases.forEach((testCase) => {
            $(this.getTestCasesHtml(testCase)).appendTo(this.utilityContainerEle);
        });

        this.attachTestCasesEvent();
        this.attachTestSendEvent();
        this.expandUtilityContainer();
    };

    UtilityView.prototype.attachTestSendEvent = function () {

        $(inputView.sendBoxEle).on('click',(event) => {
            event.stopPropagation();

            if(!inputView.inputEleIsActive){
                return false;
            }
            console.log('ok');
            this.showScroller();
        });


    };

    UtilityView.prototype.attachTestCasesEvent = function () {
        $(this.utilityContainerEle + ' .test-cases').on('click', function () {
            $(this).toggleClass("selected-test");
            utilityView.updateTestCasesState(this.id);
            inputView.updateSendState();
        });
    };


    UtilityView.prototype.showScroller = function () {
        console.log(dataModel.getActiveTestCase());

        this.hideUtilityContainer();
        $(function () {
            $("#scroller").mobiscroll().time();
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
            if(testCase.id !== id){
                $(this.utilityContainerEle + ' ' + '#' + testCase.id).removeClass("selected-test");
            }
        });
    };


    function InputView() {
        this.inputContainerEle = "#input-container";
        this.inputEle = "#input-container input";
        this.sendBoxEle = "#input-container #plane-box";
        this.sendEle = "#input-container #plane-box i";
        this.inputEleIsActive = false;
    }

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


    mobiscroll.settings = {
        theme: 'ios-dark',
        cssClass: "wheeler",
        // context: '#utility-container'
        context: '#mobi-container'
    };


    let dataModel = new DataModel();
    let chatView = new ChatView();
    let utilityView = new UtilityView();
    let inputView = new InputView();

    chatView.init();

});


