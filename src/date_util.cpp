#include "date_util.hpp"
#include "date/date.h"

date::year_month_day get_today_date()
{
    date::year_month_day today = floor<date::days>(std::chrono::system_clock::now());
    return today;
}

int day_diff(date::year_month_day start_date, date::year_month_day end_date)
{
    // Convert year_month_day objects to sys_days
    date::sys_days start_sys_days = start_date;
    date::sys_days end_sys_days = end_date;

    // Calculate the day difference
    date::days difference = end_sys_days - start_sys_days;

    // Convert the difference to a count of days
    int day_count = difference.count();
    return day_count;
}