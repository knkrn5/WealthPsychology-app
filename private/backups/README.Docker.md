### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:55555.

### Deploying your application to the docker hub cloud
docker tag wealthpsychology-app-server:latest knkrn5/wealthpsychology-app-server:v1.0
# pushing to docker hub
docker push knkrn5/wealthpsychology-app-server:v1.0