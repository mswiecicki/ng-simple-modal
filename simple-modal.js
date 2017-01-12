angular.module('simple-modal', [])
.factory('modalService', modalService);

modalService.$inject = ['$rootScope', '$window', '$sce', '$compile'];
function modalService($rootScope, $window, $sce, $compile) {

    let modalEl;
    let closeFn = function() {
        throw new Error("No open modal to be closed - you cannot get water out of stone!");
    };

    // template -  which will be wrapped with modal
    // object -  with properties to put on modal's scope
    // flag - deciding if clicking on backdrop should close modal
    // function - for additional operations to execute on closing modal
    function open({ template = '', scope = {}, backdropClosing = true, onClose = () => {} }) {
        let readyTemplate = prepareTemplate(template);
        let modalScope = setupScope(scope, onClose);
        modalEl = buildModal(readyTemplate, modalScope);
        closeFn = generateCloseFn(modalEl, onClose);
        attachCloseFn(modalEl, closeFn, backdropClosing);
        showModal(modalEl);
    }

    function prepareTemplate(template) {
        let trustedTemplate = $sce.trustAsHtml(template);
        let wholeTemplate = `
            <div id="backdrop" ng-click="_close($event)">
                <style>
                    #backdrop {
                        position: fixed;
                        top: 0; bottom: 0; left: 0; right: 0;
                        background-color: rgba(0,0,0,0.7);
                        z-index: 5;
                    }
                    #modal {
                        position: fixed;
                        top: 50%; left: 50%;
                        transform: translatey(-50%) translatex(-50%);
                        z-index: 6;
                    }
                </style>
                <div id="modal">` + trustedTemplate + `</div>
            </div>`;
        return wholeTemplate
    };

    function setupScope(scope, closeFn) {
        let modalScope = $rootScope.$new(true);
        angular.merge(modalScope, scope);
        return modalScope;
    };


    function buildModal(template, scope) {
        let linkFn = $compile(template);
        modalEl = linkFn(scope);
        return modalEl;
    };

    function generateCloseFn(modalEl, callback) {
        return function closeModal() {
            if (modalEl) {
                callback();
                modalEl.scope().$destroy();
                modalEl.remove();
            }
        };
    };

    function attachCloseFn(modalEl, closeFn, backdropClosing) {
        // add public close method
        modalEl.scope().closeModal = closeFn;
        // add "internal" closing method for backdrop
        // closing from backdrop needs to ensure what was actually clicked
        // (otherwise clicking on modal would close it)
        modalEl.scope()._close = function backdropClose($event) {
            if (backdropClosing && $event && $event.target.id === 'backdrop') {
                closeFn();
            }
        };
    }

    function showModal(modalEl) {
        $window.document.body.appendChild(modalEl[0]);
    };

    return { open, close };
};