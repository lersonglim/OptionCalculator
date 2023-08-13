cmake_minimum_required(VERSION 3.15)
project(option CXX)

set(CMAKE_CXX_STANDARD 20)

file(GLOB SOURCES src/*.cpp)

include_directories(
    ${CMAKE_SOURCE_DIR}/include
)

include_directories(
    ${CMAKE_SOURCE_DIR}/vcpkg/installed/arm64-osx/include
)

add_subdirectory(pybind11)  # or find_package(pybind11)

# 

pybind11_add_module(option ${SOURCES})

# add_executable(option_main ${SOURCES})
