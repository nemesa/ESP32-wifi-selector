class MainViewModel {
    constructor() {

        this.ajaxHandler = new AjaxHandler();
        this.connectionInfo = new ConnectionInfoViewModel(this.ajaxHandler);

        this.menu = {
            startup: {
                templateName: 'menu-startup',
                viewModel: new MenuStartupViewModel()
            },
            connectToWifi: {
                templateName: 'menu-connect-to-wifi',
                viewModel: new MenuConnectToWifiViewModel(this.ajaxHandler, this.connectionInfo)
            },
            settings: {
                templateName: 'menu-settings',
                viewModel: new MenuSettingsViewModel(this.ajaxHandler, this.connectionInfo)
            }
        }

        this.activeMenuTemplateName = ko.observable(this.menu.startup.templateName);
        this.activeMenuViewModel = ko.observable(this.menu.startup.viewModel);

        this.setMenu = (menuItem) => {
            this.activeMenuTemplateName('menu-empty');
            this.activeMenuViewModel(menuItem.viewModel); //set VM first!!!
            this.activeMenuTemplateName(menuItem.templateName);

            menuItem.viewModel.afterMenuRequested();
        }

        this.afterInit = () => {

        }

    }


};