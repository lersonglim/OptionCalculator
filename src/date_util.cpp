#include "date_util.hpp"
#include <chrono>
#include <boost/algorithm/string.hpp>

std::chrono::year_month_day get_today_date()
{
    const std::chrono::time_point now{std::chrono::system_clock::now()};
    const std::chrono::year_month_day ymd{std::chrono::floor<std::chrono::days>(now)};
    return ymd;
}

int day_diff(std::chrono::year_month_day start_date, std::chrono::year_month_day end_date)
{
    // Convert year_month_day objects to sys_days
    auto diff = std::chrono::sys_days(end_date) - std::chrono::sys_days(start_date);

    // Calculate the day difference
    double day_count = diff.count();
    return day_count;
}

std::chrono::year_month_day date_from_str(std::string date_string)
{
    std::vector<std::string> date_parts;
    boost::split(date_parts, date_string, boost::is_any_of("-"));

    std::chrono::year_month_day date(std::chrono::year(std::stoi(date_parts[0])), std::chrono::month(std::stoi(date_parts[1])), std::chrono::day(std::stoi(date_parts[2])));

    return date;
}