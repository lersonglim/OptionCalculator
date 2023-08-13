#ifndef date_util_HPP
#define date_util_HPP

#include <chrono>
#include <iostream>

std::chrono::year_month_day get_today_date();
std::chrono::year_month_day date_from_str(std::string date_string);
int day_diff(std::chrono::year_month_day start_date, std::chrono::year_month_day end_date);

#endif