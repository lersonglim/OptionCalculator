compile:
	cmake -B build/ -S . -DCMAKE_TOOLCHAIN_FILE=vcpkg/scripts/buildsystems/vcpkg.cmake
	cmake --build build/

run:
	build/option_main

start-zookeeper:
	zookeeper-server-start.sh ~/kafka_2.13-3.5.1/config/zookeeper.properties

start-kafka-server:
	kafka-server-start.sh ~/kafka_2.13-3.5.1/config/server.properties

start-kafka-consumer:
	kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic spx --from-beginning