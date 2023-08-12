#ifndef date_util_HPP
#define date_util_HPP

#include "date/date.h"

using namespace date::literals;

date::year_month_day get_today_date();
int day_diff(date::year_month_day date_1, date::year_month_day date_2);

#endif