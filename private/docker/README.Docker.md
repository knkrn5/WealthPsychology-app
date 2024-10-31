### Building and running your application

# clearing the Docker build cache
docker builder prune -a

docker compose up --build
docker-compose build --no-cache

docker-compose logs nginx

## removing old image
docker rmi wealthpsychology-app-server:latest

Your application will be available at http://localhost:55555.

### how to make tag Deploying your application to the docker hub cloud
docker tag <local_image_name> <docker_hub_username>/<repository_name>:<tag>


### How to overwrite the tag
# first update docker desktop tag
docker build -t wealthpsychology-app-server:latest .
# Then create the same tag of the already existing in docker hub
docker tag wealthpsychology-app-server:latest knkrn5/wealthpsychology-app-server:v1.0.1
# and then push the same again to docker hub
docker push knkrn5/wealthpsychology-app-server:v1.0.1



docker push knrkrn5/nginxadding:nginx
docker push knrkrn5/nginxadding:server
