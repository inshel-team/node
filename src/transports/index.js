import SocketIO from './socket-io'

const transports = {
  SocketIO
}

export default (options) => (transports[options.transport] || transports['SocketIO'])(options)
