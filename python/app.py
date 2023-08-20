import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import sys

import logging
from kafka import KafkaConsumer
import asyncio

sys.path.append("../build")

import option
from concurrent.futures import ProcessPoolExecutor
from kafka import KafkaConsumer
import threading

logging.basicConfig(level=logging.INFO)

class LatestSpotWebSocketHandler(tornado.websocket.WebSocketHandler):
    connections = set()

    def check_origin(self, origin):
        return True # Otherwise Frond-End can't connect via websocket

    def open(self):
        self.connections.add(self)
        self.write_message({"spx": {"spot": self.application.spx_latest_spot}})
        print("WebSocket opened")

    def on_close(self):
        self.connections.remove(self)
        print("WebSocket closed")


class OptionCalculatorApp(tornado.web.Application):

    def __init__(self, *args, **kwargs):
        self.executor = ProcessPoolExecutor(max_workers=4)
        topic = 'spx'
        bootstrap_servers = 'localhost:9092'
        self.loop = tornado.ioloop.IOLoop.current()
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers,
            group_id='your_group_id',
            auto_offset_reset='latest',
            enable_auto_commit=False
        )
        self.spx_latest_spot = None
        self.consumer_thread = threading.Thread(target=self.kafka_consumer_thread)
        self.consumer_thread.start()
        super().__init__(*args, **kwargs)

    def kafka_consumer_thread(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        for message in self.consumer:
            # key = message.key
            value = round(float(message.value))
            print(value)
            self.spx_latest_spot = value
            for connection in LatestSpotWebSocketHandler.connections:
                connection.write_message({"spx": {"spot": self.spx_latest_spot}})

def calc_wrapper(option, spot, request_type="price"):
    if request_type == "price":
        return option.price(spot)
    elif request_type == "delta":
        return option.delta(spot)
    else:
        raise ValueError("Unknown request_type {}".format(request_type))

def generate_points(x, n_points, percentage):
    res = []
    
    left_points = int((n_points - 1)/2)
    right_points = n_points - left_points

    for i in range(left_points+1):
        res.append(x - x*percentage*i)

    for i in range(right_points+1):
        res.append(x + x*percentage*i)

    res.append(x)
    return sorted(res)

def run_task(data, x_points):
    call_option = option.EuropeanOption(data["strike"], data["rate"], data["vol"], option.CallPut.call, data["expiry"])
    return [{"x": round(x), "y":round(calc_wrapper(call_option, x, data["request_type"]), 4)} for x in x_points]

def run_task_for_expired(data, x_points):
    expired_call_option = option.EuropeanOption(data["strike"], data["rate"], data["vol"], option.CallPut.call, 0)
    return [{"x": round(x), "y":round(calc_wrapper(expired_call_option, x, data["request_type"]), 4)} for x in x_points]

class PayOffHandler(tornado.web.RequestHandler):

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "http://localhost:3000")

    
    async def post(self):
        try:
            data = json.loads(self.request.body)
            logging.info(data)

            data["rate"] = data["rate"] / 100
            data["vol"] = data["vol"] / 100

            # call_option = option.EuropeanOption(data["strike"], data["rate"], data["vol"], option.CallPut.call, data["expiry"])

            # expired_call_option = option.EuropeanOption(data["strike"], data["rate"], data["vol"], option.CallPut.call, 0)

            x_points = generate_points(data["strike"]*0.99, 15, 0.02)

            future_results = self.application.executor.submit(run_task, data, x_points)

            future_results_for_expired = self.application.executor.submit(run_task_for_expired, data, x_points)

            response = {data["request_type"]: future_results.result(), "{}_expired".format(data["request_type"]): future_results_for_expired.result()}
            
            self.set_status(200)
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except json.JSONDecodeError:
            self.set_status(400)
            self.write("Invalid JSON data")

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
    return OptionCalculatorApp([
        (r"/api/price", PriceHandler), 
        (r"/api/payoff", PayOffHandler), 
        (r"/api/latestspot", LatestSpotWebSocketHandler), 
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Listening on port 8888")
    tornado.ioloop.IOLoop.current().start()
