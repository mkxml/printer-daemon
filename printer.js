const np = require('printer');

function print(zpl) {
  return new Promise((resolve, reject) => {
    const name = getPrinterName();
    np.printDirect({
      data: zpl,
      printer: name,
      docname: 'Test label',
      type: 'RAW',
      success: resolve,
      error: reject,
    });
  });
}

function getPrinterName() {
  return np.getDefaultPrinterName();
}

module.exports = { print, getPrinterName };
