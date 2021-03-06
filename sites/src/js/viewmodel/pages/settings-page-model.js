import ContainerJS         from "container-js"
import Observable          from "../../utils/observable"

export default class SettingsPageModel extends Observable {

  constructor() {
    super();
    this.viewModelFactory = ContainerJS.Inject;
  }

  postCreate() {
    this.mailAddressSetting       =
      this.viewModelFactory.createMailAddressSettingModel();
    this.passwordSetting   =
      this.viewModelFactory.createPasswordSettingModel();
    this.securitiesSetting =
      this.viewModelFactory.createSecuritiesSettingModel();
    this.smtpServerSetting =
      this.viewModelFactory.createSMTPServerSettingModel();
    this.pairSetting =
      this.viewModelFactory.createPairSettingModel();
  }

  initialize() {
    this.mailAddressSetting.initialize();
    this.securitiesSetting.initialize();
    this.smtpServerSetting.initialize();
    this.pairSetting.initialize();
    this.passwordSetting.initialize();
  }
}
 
