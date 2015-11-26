import SelectionModel    from "../widgets/selection-model"
import Deferred          from "../../utils/deferred"
import NotificationModel from "./notification-model"

export default class NotificationSelectionModel extends SelectionModel {

  constructor( notificationService,
    actionService, eventQueue, urlResolver) {
    super();
    this.notificationService = notificationService;
    this.actionService = actionService;
    this.urlResolver = urlResolver;
    this.eventQueue = eventQueue;
  }

  convertItem(item) {
    return new NotificationModel(item, this.urlResolver);
  }

  loadItem(notificationId) {
    this.selected = null;
    this.notificationService.get(notificationId).then( (notification)=> {
      this.selected = this.convertItem(notification);
    });
  }

  markAsRead(notification) {
    notification.readAt = new Date();
    if (this.tableModel) {
      const table = this.tableModel;
      table.setProperty("items", table.items, () => false );
      table.notRead = table.notRead > 0 ? table.notRead-1 : 0;
    }
    this.notificationService.markAsRead( notification.id );
  }

  executeAction( notification, action ) {
    this.actionService.post(
      notification.backtest ? notification.backtest.id : null,
      notification.agent.id, action).then((result) => {
      this.eventQueue.push(
        this.createResponseMessage(result, notification, action));
    }, (error)  => {
      error.preventDefault = true;
      this.eventQueue.push(this.createErrorMessage(error, notification));
    });
  }
  createResponseMessage(result, notification, action) {
    return {
      type: "info",
      message: notification.agent.name + " : "
        + (result.message || "アクション \"" + action + "\" を実行しました")
    };
  }
  createErrorMessage(error, notification) {
    return {
      type: "error",
      message: notification.agent.name
        + " : アクション実行時にエラーが発生しました。"
        + "ログを確認してください。"
    };
  }

  set selected( notification ) {
    this.setProperty("selected", notification);
    if (notification && !notification.readAt) {
      this.markAsRead(notification);
    }
  }
  get selected( ) {
    return this.getProperty("selected");
  }
}
