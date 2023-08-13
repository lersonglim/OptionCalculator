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
    print("Cplusplus implied vol value: ", call_option.implied_vol(spot, observed_price))
    

# Reference: https://stackoverflow.com/questions/61289020/fast-implied-volatility-calculation-in-python
print("Measuring python pricing time")
import numpy as np
from scipy.stats import norm

N = norm.cdf
def bs_call(S, K, T, r, vol):
    d1 = (np.log(S/K) + (r + 0.5*vol**2)*T) / (vol*np.sqrt(T))
    d2 = d1 - vol * np.sqrt(T)
    return S * norm.cdf(d1) - np.exp(-r * T) * K * norm.cdf(d2)

def bs_vega(S, K, T, r, sigma):
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    return S * norm.pdf(d1) * np.sqrt(T)

def find_vol(target_value, S, K, T, r, *args):
    MAX_ITERATIONS = 200
    PRECISION = 0.001
    sigma = 34.29/100
    for i in range(0, MAX_ITERATIONS):
        price = bs_call(S, K, T, r, sigma)
        vega = bs_vega(S, K, T, r, sigma)
        diff = target_value - price  # our root
        if (abs(diff) < PRECISION):
            return sigma
        sigma = sigma + diff/vega # f(x) / f'(x)
    return sigma # value wasn't found, return best guess so far

with catchtime() as t:
    print("Python implied vol value: ", find_vol(1000, spot, strike, 171/365, rate, sigma))
