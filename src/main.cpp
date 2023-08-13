#include <iostream>
#include "option.hpp"
#include "date_util.hpp"
#include <chrono>

int main(int argc, char *argv[])
{
    float strike = 1.0;

    std::chrono::year_month_day expiry_date = date_from_str("2024-1-31");

    EuropeanOption call_option(3700, 5.25 / 100, 34.29 / 100, CallPut::call, expiry_date);
    EuropeanOption put_option(3700, 5.25 / 100, 34.29 / 100, CallPut::put, expiry_date);

    std::chrono::year_month_day today = date_from_str("2023-8-13");

    std::cout << call_option.price(4464.05) << std::endl;

    std::cout << put_option.price(4464.05) << std::endl;

    // std::cout << option.implied_vol(4464.05, 947.38) << std::endl;

    // std::cout << day_diff(today, expiry_date) << std::endl;
    // std::cout << option.calc_time_to_maturity(today) << std::endl;
    return 0;
}