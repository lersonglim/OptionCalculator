#include <iostream>
#include "option.hpp"
#include "date_util.hpp"
#include "date/date.h"
using namespace date::literals;

int main(int argc, char *argv[])
{
    float strike = 1.0;

    date::year_month_day expiry_date = 2023_y / date::August / 31;

    EuropeanOption option(1.0, 1.0, 1.0, CallPut::call, expiry_date);
    date::year_month_day today = get_today_date();

    // int res = day_diff(today, today);

    // std::cout << "value " << res << std::endl;
    std::cout << "Today's date: " << today << std::endl;
    std::cout << option.price(1.0) << std::endl;
    std::cout << option.calc_time_to_maturity(today) << std::endl;
    return 0;
}