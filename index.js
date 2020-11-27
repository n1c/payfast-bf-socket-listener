// https://bf.payfast.co.za/
const io = require('socket.io-client');
const DEBUG = false;

var log = function () {
  console.log.apply(console, arguments);
}

var dd = function () {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
};

const socket = io('wss://bf.payfast.co.za:1302/', {
  reconnectionDelayMax: 1000,
  transports: [ 'websocket', ],
});

/*
socket.onAny((event, ...args) => {
  log(`got ${event}`);
});
*/

// WS Events
socket.on('topOs', (e) => {
  dd('topOs', e);
});

socket.on('userConnected', (e) => {
  dd('userConnected', e);
  if (!e.data || e.data.length == 0) {
    return;
  }

  e.data.forEach(d => {
    if (!d?._source?.['@fields']?.ctxt_amount) {
      return;
    }

    const value = Math.floor(d._source['@fields'].ctxt_amount / 100)
    log(`R ${value}`);
  });
});

socket.on('maxTransaction', (e) => {
  dd('maxTransactions', e);
});

socket.on('topMethod', (e) => {
  dd('topMethod', e);
});

// Socket events
socket.on('connect', () => {
  log('Connected!');
});

socket.on('reconnect_attempt', () => {
  log('Reconnect_attempt');
});

socket.on('disconnect', () => {
  log('Disconnected, trying .open');
  socket.open();
});
