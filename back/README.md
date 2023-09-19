kubectl port-forward svc/pxf-cra-mongodb 27017:27017

docker run --network=host \
-e ME_CONFIG_MONGODB_ADMINUSERNAME=root \
-e ME_CONFIG_MONGODB_ADMINPASSWORD=example \
-e ME_CONFIG_MONGODB_URL=mongodb://root:example@localhost:27017 \
mongo-express:latest


