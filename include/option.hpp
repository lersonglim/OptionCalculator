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
    EuropeanOption(double strike, double rate, double vol, CallPut callput, std::chrono::year_month_day expiry_date); // Constructor
    EuropeanOption(double strike, double rate, double vol, CallPut callput, std::string expiry_date_str);
    ~EuropeanOption(); // Destructor

    double m_strike;
    double m_rate;
    double m_vol;
    CallPut m_callput;
    std::chrono::year_month_day m_expiry;

    // double price();
    double calc_time_to_maturity(std::chrono::year_month_day date);
    double implied_vol(double spot, double observed_price);

    double vega(double spot);
    double vega(double spot, double implied_vol);

    double price(double spot);
    double price(double spot, double vol);
    double calc_d1(double spot, double time_to_maturity);
    double calc_d1(double spot, double time_to_maturity, double vol);
    double calc_d2(double d2, double time_to_maturity);
    double calc_d2(double d2, double time_to_maturity, double vol);
    // double price(double spot, double time_to_maturity);
};

#endif
