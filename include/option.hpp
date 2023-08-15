#ifndef EuropeanOption_HPP
#define EuropeanOption_HPP

#include <chrono>
#include <array>

enum CallPut
{
    call = 1,
    put = -1,
};

class EuropeanOption
{
public:
    // EuropeanOption(double strike, double rate, double vol, CallPut callput, std::chrono::year_month_day expiry_date);
    // EuropeanOption(double strike, double rate, double vol, CallPut callput, std::string expiry_date_str);
    EuropeanOption(double strike, double rate, double vol, CallPut callput, int days_until_expiry);

    ~EuropeanOption(); // Destructor

    double m_strike;
    double m_rate;
    double m_vol;
    int m_expiry_days;
    CallPut m_callput;
    // std::chrono::year_month_day m_expiry;

    // double price();
    // double calc_time_to_maturity(std::chrono::year_month_day date);
    double implied_vol(double spot, double observed_price);

    double delta(double spot);
    double gamma(double spot);
    double vega(double spot);
    double vega(double spot, double implied_vol);
    double theta(double spot);
    double rho(double spot);

    double price(double spot);
    double price(double spot, double vol);
    double calc_d1(double spot, double time_to_maturity);
    double calc_d1(double spot, double time_to_maturity, double vol);
    double calc_d2(double d2, double time_to_maturity);
    double calc_d2(double d2, double time_to_maturity, double vol);
    // double price(double spot, double time_to_maturity);
};

#endif
