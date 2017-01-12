angular.module('simple-modal', [])
.factory('modalService', modalService);

modalService.$inject = ['$rootScope', '$window', '$sce', '$compile'];
function modalService($rootScope, $window, $sce, $compile) {

    let modalElement;
    let close = function() {
        throw new ReferenceError("No open modal to be closed - you cannot get water out of stone!");
    };

    let config = {
        template = '',          // template which will be wrapped with modal
        scope = {},             // object with properties to put on modal's scope
        backdropClosing = true, // flag deciding if clicking on backdrop should close modal
        onClose = () => {}      // additional operations to execute on closing modal
    }

    function open(config) {
        let template = prepareTemplate(config.template);
        let modalScope = setupScope(config.scope, config.onClose);
        buildModal(template, modalScope);
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

        close = function closeModal() {
            if (modalElement) {
                closeFn();
                modalElement.scope().$destroy();
                modalElement.remove();
            }
        };
        // add "internal" closing function for backdrop
        // closing from backdrop needs to ensure what was actually clicked
        // (otherwise clicking on modal would close it)
        modalScope._close = function backdropClose($event) {
            if (backdropClosing && $event && $event.target.id === 'backdrop') {
                close();
            }
        };
        // and public one
        modalScope.closeModal = close;

        return modalScope;
    };

    function buildModal(template, scope) {
        let linkFn = $compile(template);
        modalElement = linkFn(scope);
        $window.document.body.appendChild(modalElement[0]);
    }

    return { open, close };
};