#! /bin/bash

# This script compiles the protocol buffers for the project.
if [[ "$(docker images -q namely/protoc-all 2> /dev/null)" == "" ]]; then
    docker pull namely/protoc-all;
fi
allProtoFolders=($(ls -d protocolbuffers/*))
for i in "${allProtoFolders[@]}"
do
   docker run --rm -v $(pwd):/defs namely/protoc-all -d $i -l go -o go;
   docker run --rm -v $(pwd):/defs namely/protoc-all -d $i -l go -o db;
   docker run --rm -v $(pwd):/defs namely/protoc-all -d $i -l typescript -o ts/src/protocolbuffers;
done
# Fix the imports for the typescript files. The library exports the default, but the
# generated code expects the * export
for i in ts/src/protocolbuffers/*; do
    sed -i -- 's/* as _m0/{ default as _m0 }/g' $i
done
# Compile the protocol buffers.