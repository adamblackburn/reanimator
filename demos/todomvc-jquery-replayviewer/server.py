import SimpleHTTPServer
import SocketServer

PORT = 12000



Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
Handler.extensions_map[''] = 'text/html'

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
