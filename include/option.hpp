#ifndef EuropeanOption_HPP
#define EuropeanOption_HPP

#include "date/date.h"

enum CallPut
{
    call = 1,
    put = -1,
};

class EuropeanOption
{
public:
    EuropeanOption(float strike, float rate, float vol, CallPut callput, date::year_month_day expiry_date); // Constructor
    ~EuropeanOption();                                                                                      // Destructor

    float m_strike;
    float m_rate;
    float m_vol;
    CallPut m_callput;
    date::year_month_day m_expiry;

    // float price();
    int calc_time_to_maturity(date::year_month_day date);
    float price(float spot);
    // float price(float spot, float time_to_maturity);
};

#endif
