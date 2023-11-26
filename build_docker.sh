docker build --build-arg API_URL=$1 . --tag=scryptan/versus:debug
docker push scryptan/versus:debug
