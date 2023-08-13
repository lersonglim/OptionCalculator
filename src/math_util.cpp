#include <cmath>

double cdf_normal(double x)
{
    return 0.5 * (1.0 + std::erf(x / sqrt(2.0)));
}