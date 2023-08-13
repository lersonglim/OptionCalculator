cmake_minimum_required(VERSION 3.15)
project(TestBinding CXX)

set(CMAKE_CXX_STANDARD 20)

file(GLOB SOURCES src/*.cpp)

include_directories(
    ${CMAKE_SOURCE_DIR}/include
)
# include_directories(
#     ${CMAKE_SOURCE_DIR}/pybind11/include
# )

include_directories(
    ${CMAKE_SOURCE_DIR}/vcpkg/installed/arm64-osx/include
)

# set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# find_package(Boost REQUIRED)

# target_link_libraries(${PROJECT_NAME} PRIVATE Boost::boost)

add_subdirectory(pybind11)  # or find_package(pybind11)

# pybind11_add_module(TestBinding src/main2.cpp)
pybind11_add_module(TestBinding ${SOURCES})

target_include_directories( TestBinding
    INTERFACE
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/pybind11/include/> )

set_target_properties( TestBinding
  PROPERTIES
  CXX_STANDARD 20
  CXX_STANDARD_REQUIRED ON
  PREFIX ""
  SUFFIX ".so"
)