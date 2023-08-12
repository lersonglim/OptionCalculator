compile:
	conan install . --build=missing
	cmake --preset conan-release
	cmake --build --preset conan-release

run:
	build/Release/OptionCalculator