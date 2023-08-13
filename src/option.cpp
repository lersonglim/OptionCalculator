#include "option.hpp"
#include "date_util.hpp"
#include "math_util.hpp"

#include <boost/math/tools/roots.hpp>

#include <cmath>
#include <exception>

EuropeanOption::EuropeanOption(double strike, double rate, double vol, CallPut callput, std::chrono::year_month_day expiry_date) : m_strike(strike), m_rate(rate), m_vol(vol), m_callput(callput), m_expiry(expiry_date) {}

EuropeanOption::EuropeanOption(double strike, double rate, double vol, CallPut callput, std::string expiry_date_str) : m_strike(strike), m_rate(rate), m_vol(vol), m_callput(callput)
{
    std::chrono::year_month_day expiry_date = date_from_str(expiry_date_str);
    m_expiry = expiry_date;
}

EuropeanOption::~EuropeanOption() {}

double EuropeanOption::calc_time_to_maturity(std::chrono::year_month_day date)
{
    return day_diff(date, m_expiry) / 365.0;
}

double EuropeanOption::calc_d1(double spot, double t, double vol)
{
    return (std::log(spot / m_strike) + (m_rate + vol * vol / 2) * t) / (vol * std::sqrt(t));
}

double EuropeanOption::calc_d1(double spot, double t)
{
    return (std::log(spot / m_strike) + (m_rate + m_vol * m_vol / 2) * t) / (m_vol * std::sqrt(t));
}

double EuropeanOption::calc_d2(double d1, double t, double vol)
{
    return d1 - (vol * std::sqrt(t));
}

double EuropeanOption::calc_d2(double d1, double t)
{
    return d1 - (m_vol * std::sqrt(t));
}

double EuropeanOption::price(double spot)
{
    std::chrono::year_month_day today = get_today_date();
    double t = calc_time_to_maturity(today);
    double d1 = calc_d1(spot, t);
    double d2 = calc_d2(d1, t);

    if (m_callput == CallPut::call)
    {
        return cdf_normal(d1) * spot - cdf_normal(d2) * m_strike * std::exp(-m_rate * t);
    }
    else if (m_callput == CallPut::put)
    {
        return cdf_normal(-d2) * m_strike * std::exp(-m_rate * t) - cdf_normal(-d1) * spot;
    }
    else
    {
        throw std::runtime_error("Unknown callput option");
    }
}

double EuropeanOption::price(double spot, double vol)
{
    std::chrono::year_month_day today = get_today_date();
    double t = calc_time_to_maturity(today);
    double d1 = calc_d1(spot, t, vol);
    double d2 = calc_d2(d1, t, vol);

    double price = cdf_normal(d1) * spot - cdf_normal(d2) * m_strike * std::exp(-m_rate * t);

    std::cout << "Price is :" << price << std::endl;

    return price;
}

double EuropeanOption::implied_vol(double spot, double observed_price)
{
    auto func = [&](double vol)
    {
        std::cout << "trial vol is :" << vol << std::endl;
        return std::make_tuple(price(spot, vol) - observed_price, vega(spot, vol));
    };

    double sol = boost::math::tools::newton_raphson_iterate(func, m_vol, 0.001, 2.000, 3);
    return sol;
}

double EuropeanOption::vega(double spot, double implied_vol)
{
    std::chrono::year_month_day today = get_today_date();
    double t = calc_time_to_maturity(today);

    double d1 = calc_d1(spot, implied_vol);
    double N_d1 = std::exp(-0.5 * d1 * d1) / std::sqrt(2 * M_PI);
    double vega = spot * N_d1 * sqrt(t);

    return vega;
}