#include <iostream>
#include "option.hpp"
#include "date_util.hpp"
#include <chrono>

#include <pybind11/pybind11.h>

namespace py = pybind11;

PYBIND11_MODULE(option, m)
{
    py::class_<EuropeanOption>(m, "EuropeanOption")
        .def(py::init<double, double, double, CallPut, std::string>())
        .def("implied_vol", (double(EuropeanOption::*)(double, double)) & EuropeanOption::implied_vol)
        .def("vega", (double(EuropeanOption::*)(double, double)) & EuropeanOption::vega)
        .def("price", (double(EuropeanOption::*)(double)) & EuropeanOption::price)
        .def("price", (double(EuropeanOption::*)(double, double)) & EuropeanOption::price)
        .def("calc_d1", (double(EuropeanOption::*)(double, double)) & EuropeanOption::calc_d1)
        .def("calc_d1", (double(EuropeanOption::*)(double, double, double)) & EuropeanOption::calc_d1)
        .def("calc_d2", (double(EuropeanOption::*)(double, double)) & EuropeanOption::calc_d2)
        .def("calc_d2", (double(EuropeanOption::*)(double, double, double)) & EuropeanOption::calc_d2);

    py::enum_<CallPut>(m, "CallPut")
        .value("call", CallPut::call)
        .value("put", CallPut::put)
        .export_values();
}

int main(int argc, char *argv[])
{
    EuropeanOption call_option(3700, 5.25 / 100, 34.29 / 100, CallPut::call, "2024-1-31");
    EuropeanOption put_option(3700, 5.25 / 100, 34.29 / 100, CallPut::put, "2024-1-31");
    std::cout << call_option.price(4464.05) << std::endl;
    std::cout << put_option.price(4464.05) << std::endl;
    return 0;
}