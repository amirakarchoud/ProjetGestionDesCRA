#!/bin/sh

docker kill mongoui
docker container rm mongoui

connection="$(nmcli -t -f name connection show --active | awk 'NR==1 {print $1}')"

# shellcheck disable=SC2081
if [ "$connection" != *"VPN"* ]; then
  nmcli con up Proxym_VPN --ask
fi

kubectl port-forward svc/pxf-cra-mongodb 27017:27017 &

docker run -d --rm --name mongoui --network=host \
  -e ME_CONFIG_MONGODB_ADMINUSERNAME=root \
  -e ME_CONFIG_MONGODB_ADMINPASSWORD=example \
  -e ME_CONFIG_MONGODB_URL=mongodb://root:example@localhost:27017 \
  mongo-express:latest

echo "Started"

wait
