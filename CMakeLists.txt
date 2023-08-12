cmake_minimum_required(VERSION 3.15)
project(OptionCalculator CXX)

# Set include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(date REQUIRED CONFIG)

# Build executable
file(GLOB SOURCES src/*.cpp)
add_executable(${PROJECT_NAME} ${SOURCES})

# Main SDL library for init
target_link_libraries(${PROJECT_NAME} PRIVATE date::date)

