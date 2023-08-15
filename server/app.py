import tornado.ioloop
import tornado.web
import json
import sys

sys.path.append("../build")

import option

class PriceHandler(tornado.web.RequestHandler):

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "http://localhost:3000")

    def post(self):
        try:
            data = json.loads(self.request.body)
            
            data["rate"] = data["rate"] / 100
            data["vol"] = data["vol"] / 100

            call_option = option.EuropeanOption(data["strike"], data["rate"], data["vol"], option.CallPut.call, data["expiry"])

            response = {
                "price": round(call_option.price(data["spot"]), 4),
                "delta": round(call_option.delta(data["spot"]), 4),
                "gamma": round(call_option.gamma(data["spot"]), 4),
                "vega": round(call_option.vega(data["spot"])/100, 4),
                "theta": round(call_option.theta(data["spot"])/365, 4),
                "rho": round(call_option.rho(data["spot"])/100, 4),
            }
            
            self.set_status(200)
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except json.JSONDecodeError:
            self.set_status(400)
            self.write("Invalid JSON data")

def make_app():
    return tornado.web.Application([
        (r"/api/price", PriceHandler), 
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Listening on port 8888")
    tornado.ioloop.IOLoop.current().start()
