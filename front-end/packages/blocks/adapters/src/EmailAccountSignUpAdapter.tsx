import { v4 as uuidv4 } from 'uuid';
import { runEngine } from '../../../framework/src/RunEngine';
import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import MessageEnum, {
  getName
} from '../../../framework/src/Messages/MessageEnum';

export default class EmailAccountSignUpAdapter {
  send: (message: Message) => void;

  constructor() {
    const blockId = uuidv4();
    this.send = message => runEngine.sendMessage(blockId, message);
    runEngine.attachBuildingBlock(this as IBlock, [
      getName(MessageEnum.NavigateEmailSignUpMessage)
    ]);
  }

  convert = (from: Message): Message => {
    const to = new Message(getName(MessageEnum.NavigationMessage));

    to.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'EmailAccountRegistration'
    );

    to.addData(
      getName(MessageEnum.NavigationPropsMessage),
      from.getData(getName(MessageEnum.NavigationPropsMessage))
    );

    return to;
  };

  receive(from: string, message: Message): void {
    this.send(this.convert(message));
  }
}
