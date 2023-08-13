cmake_minimum_required(VERSION 3.15)
project(OptionCalculator CXX)

set(CMAKE_CXX_STANDARD 20)

# Set include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Build executable
file(GLOB SOURCES src/*.cpp)
add_executable(${PROJECT_NAME} ${SOURCES})
find_package(Boost REQUIRED)
# Main SDL library for init
target_link_libraries(${PROJECT_NAME} PRIVATE Boost::boost)
target_link_libraries(${PROJECT_NAME} PRIVATE Boost::math)

