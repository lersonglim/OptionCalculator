compile:
	cmake -B build/ -S . -DCMAKE_TOOLCHAIN_FILE=vcpkg/scripts/buildsystems/vcpkg.cmake
	cmake --build build/

run:
	build/option_main