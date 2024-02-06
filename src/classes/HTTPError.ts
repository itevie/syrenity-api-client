interface ErrorData {
  error: string;
  url: string;
  rawResponse: {[key: string]: any}
  rawError?: ErrorDataSection | ErrorDataSection;
}

interface ErrorDataSection {
  message: string;
  at: string;
}

export default class HTTPError extends Error {
  public data: ErrorData;

  constructor(message: string, data: ErrorData) {
    // Construct message
    let msg = `${data.url} ${message} `;
    if (data.error) msg += `Error: ${data.error} `;
    if (data.rawError?.message) msg += ` Error: ${data.error} `;
    super(message);

    // Set the data
    this.data = data;
  }
}