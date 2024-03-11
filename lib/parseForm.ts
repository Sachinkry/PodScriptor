import { IncomingMessage } from 'http';
import multiparty from 'multiparty';

type ParsedForm = {
  fields: multiparty.Fields;
  files: multiparty.Files;
};

const parseForm = (req: IncomingMessage): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export default parseForm;
