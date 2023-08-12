#include "option.hpp"
#include "date_util.hpp"

EuropeanOption::EuropeanOption(float strike, float rate, float vol, CallPut callput, date::year_month_day expiry_date) : m_strike(strike), m_rate(rate), m_vol(vol), m_callput(callput), m_expiry(expiry_date) {}

EuropeanOption::~EuropeanOption() {}

int EuropeanOption::calc_time_to_maturity(date::year_month_day date)
{
    return day_diff(date, m_expiry);
}

float EuropeanOption::price(float spot)
{
    return spot;
}