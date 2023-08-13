import sys

sys.path.append("./build")

from time import perf_counter
from contextlib import contextmanager

@contextmanager
def catchtime() -> float:
    start = perf_counter()
    yield lambda: perf_counter() - start
    print(f'Time: {perf_counter() - start:.7f} seconds')

import option

strike = 3700
rate = 5.25/100
sigma = 34.29/100
spot = 4464.05
observed_price = 1000

print("Measuring cplusplus pybind pricing time")

with catchtime() as t:
    call_option = option.EuropeanOption(strike, rate, sigma, option.CallPut.call, "2024-1-31")
    print("Cplusplus price value: ", call_option.price(spot))
    
# Reference: https://stackoverflow.com/questions/61289020/fast-implied-volatility-calculation-in-python
print("Measuring python pricing time")
import numpy as np
from scipy.stats import norm

N = norm.cdf
def bs_call(S, K, T, r, vol):
    d1 = (np.log(S/K) + (r + 0.5*vol**2)*T) / (vol*np.sqrt(T))
    d2 = d1 - vol * np.sqrt(T)
    return S * norm.cdf(d1) - np.exp(-r * T) * K * norm.cdf(d2)

with catchtime() as t:
    print("Python price value: ", bs_call(spot, strike, 171/365, rate, sigma))
