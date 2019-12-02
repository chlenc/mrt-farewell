run landing

docker build -t landing  ./landing
docker run -d -p 3000:80 landing     

