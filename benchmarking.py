import sys

sys.path.append("./build")

from time import perf_counter
from contextlib import contextmanager

@contextmanager
def catchtime() -> float:
    start = perf_counter()
    yield lambda: perf_counter() - start
    print(f'Time: {perf_counter() - start:.3f} seconds')

import option

strike = 3700
rate = 5.25/100
sigma = 34.29/100
spot = 4464.05

print("Measuring cplusplus pybind pricing time")

with catchtime() as t:
    call_option = option.EuropeanOption(strike, rate, sigma, option.CallPut.call, "2024-1-31")
    print(call_option.price(spot))

from optionprice import Option

print("Measuring python pricing time")
with catchtime() as t:
    call_option = Option(european=True,
                        kind='call',
                        s0=spot,
                        k=strike,
                        t=171,
                        sigma=sigma,
                        r=rate,
                        dv=0)
    price = call_option.getPrice()
    print(price)
