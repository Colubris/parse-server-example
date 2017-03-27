#!/bin/sh

size=$(cat parse-clients-config.json | jq '.apps | length')
max=`expr $size - 1`

for i in `seq 0 $max`
do
    port=$(cat parse-clients-config.json | jq ".apps[$i].port")
    forever start -s index.js $i > /dev/null
done