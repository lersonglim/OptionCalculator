#include <cmath>

double cdf_normal(double x)
{
    return 0.5 * (1.0 + std::erf(x / sqrt(2.0)));
}

double pdf_normal(double x)
{
    return std::exp(-0.5 * x * x) / std::sqrt(2 * M_PI);
}