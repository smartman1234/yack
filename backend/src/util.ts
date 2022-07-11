import { v4 as uuidv4 } from 'uuid';

export const generateUniqueMessageId: any = (): string => {
  const uuid:string = uuidv4();
  const uuidWithoutDashes:string = uuid.replace(/-/gi, "");

  return uuidWithoutDashes + "@inbox.yack.app";
}
