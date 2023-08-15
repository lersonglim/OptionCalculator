#include "option.hpp"
#include "date_util.hpp"
#include "math_util.hpp"

#include <boost/math/tools/roots.hpp>

#include <cmath>
#include <exception>

// EuropeanOption::EuropeanOption(double strike, double rate, double vol, CallPut callput, std::chrono::year_month_day expiry_date) : m_strike(strike), m_rate(rate), m_vol(vol), m_callput(callput), m_expiry(expiry_date) {}

// EuropeanOption::EuropeanOption(double strike, double rate, double vol, CallPut callput, std::string expiry_date_str) : m_strike(strike), m_rate(rate), m_vol(vol), m_callput(callput)
// {
//     std::chrono::year_month_day expiry_date = date_from_str(expiry_date_str);
//     m_expiry = expiry_date;
// }

EuropeanOption::EuropeanOption(double strike, double rate, double vol, CallPut callput, int days_until_expiry) : m_strike(strike), m_rate(rate), m_vol(vol), m_callput(callput), m_expiry_days(days_until_expiry) {}

EuropeanOption::~EuropeanOption() {}

// double EuropeanOption::calc_time_to_maturity(std::chrono::year_month_day date)
// {
//     return day_diff(date, m_expiry) / 365.0;
// }

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
    double t = m_expiry_days / 365.0;
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
    double t = m_expiry_days / 365.0;
    double d1 = calc_d1(spot, t, vol);
    double d2 = calc_d2(d1, t, vol);

    double price = cdf_normal(d1) * spot - cdf_normal(d2) * m_strike * std::exp(-m_rate * t);
    return price;
}

double EuropeanOption::implied_vol(double spot, double observed_price)
{
    auto func = [&](double vol)
    {
        return std::make_tuple(price(spot, vol) - observed_price, vega(spot, vol));
    };

    double sol = boost::math::tools::newton_raphson_iterate(func, m_vol, 0.001, 2.000, 3);
    return sol;
}

double EuropeanOption::delta(double spot)
{
    double t = m_expiry_days / 365.0;
    double d1 = calc_d1(spot, t);
    return cdf_normal(d1);
}

double EuropeanOption::gamma(double spot)
{
    double t = m_expiry_days / 365.0;

    double d1 = calc_d1(spot, t);
    double N_d1_prime = pdf_normal(d1);

    return N_d1_prime / (spot * m_vol * std::sqrt(t));
}

double EuropeanOption::vega(double spot)
{
    double t = m_expiry_days / 365.0;

    double d1 = calc_d1(spot, t);
    double N_d1 = pdf_normal(d1);
    double vega = spot * N_d1 * sqrt(t);

    return vega;
}

double EuropeanOption::vega(double spot, double implied_vol)
{
    double t = m_expiry_days / 365.0;

    double d1 = calc_d1(spot, t, implied_vol);
    double N_d1 = pdf_normal(d1);
    double vega = spot * N_d1 * sqrt(t);

    return vega;
}

double EuropeanOption::theta(double spot)
{
    double t = m_expiry_days / 365.0;

    double d1 = calc_d1(spot, t);
    double d2 = calc_d2(d1, t);
    double N_d1_prime = pdf_normal(d1);
    double N_d2 = cdf_normal(d2);

    double theta = -(spot * N_d1_prime * m_vol) / (2 * std::sqrt(t)) - m_rate * m_strike * std::exp(-m_rate * t) * N_d2;

    return theta;
}

double EuropeanOption::rho(double spot)
{
    double t = m_expiry_days / 365.0;
    double d1 = calc_d1(spot, t);
    double d2 = calc_d2(d1, t);
    double N_d2 = cdf_normal(d2);

    double rho = m_strike * t * std::exp(-m_rate * t) * N_d2;
    return rho;
}